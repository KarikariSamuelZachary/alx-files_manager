const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class FilesController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name, type, parentId = '0', isPublic = false, data,
    } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }
    if (parentId !== '0') {
      const parent = await dbClient.client.db().collection('files').findOne({ _id: new ObjectId(parentId) });
      if (!parent) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parent.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const fileDocument = {
      name,
      userId,
      type,
      isPublic,
      parentId: parentId === '0' ? parentId : new ObjectId(parentId),
    };

    if (type === 'folder') {
      const result = await dbClient.client.db().collection('files').insertOne({ ...fileDocument });
      fileDocument.id = result.insertedId;
      return res.status(201).json(fileDocument);
    }

    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filename = uuid.v4();
    const localPath = path.join(folderPath, filename);
    const buffer = Buffer.from(data, 'base64');
    await fs.promises.writeFile(localPath, buffer);

    const result = await dbClient.client.db().collection('files').insertOne({ ...fileDocument, localPath });
    fileDocument.id = result.insertedId;
    return res.status(201).json(fileDocument);
  }

  static async getShow(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const fileId = req.params.id;
    const file = await dbClient.client.db().collection('files').findOne({
      _id: new ObjectId(fileId),
      userId,
    });
    if (!file) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json({
      id: fileId,
      userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId === '0' ? 0 : file.parentId.toString(),
    });
  }

  static async getIndex(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { page = 0 } = req.query;
    const strParentId = req.query.parentId || '0';
    const parentId = strParentId === '0' ? strParentId : new ObjectId(strParentId);
    const filesPerPage = 20;
    const files = await dbClient.client.db().collection('files')
      .find({ parentId, userId })
      .skip(Number(page) * filesPerPage)
      .limit(filesPerPage)
      .toArray();
    return res.status(200).json(files);
  }
}

module.exports = FilesController;

// const allFiles = await dbClient.client.db().collection('files').find({}).toArray();
// for (const file of allFiles) {
//   await dbClient.client.db().collection('files').deleteOne({ _id: file._id });
// }
// res.status(200).json({ message: 'All files have been deleted' });