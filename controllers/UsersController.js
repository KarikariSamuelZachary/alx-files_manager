import sha1 from 'sha1';
import mongoDBCore from 'mongodb/lib/core';

const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const usersCollection = dbClient.client.db().collection('users');

    const user = await usersCollection.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const newUser = await usersCollection.insertOne({ email, password: sha1(password) });

    return res.status(201).json({ id: newUser.insertedId.toString(), email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;

    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.client.db().collection('users').findOne({ _id: mongoDBCore.BSON.ObjectId(userId) });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}

module.exports = UsersController;