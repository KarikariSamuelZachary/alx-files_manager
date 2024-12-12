/**
 * UsersController handles user-related operations.
 * @class UsersController
 */
class UsersController {

  /**
   * Handles new user creation.
   * @param {Object} req - Request object.
   * @param {Object} res - Response object.
   * @returns {Promise} - Promise that resolves to the new user object.
   */
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'missing password' });
    }

    const usersCollection = dbClient.client.db().collection('users');

    const user = await usersCollection.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'already exist' });
    }

    const newUser = await usersCollection.insertOne({ email, password: sha1(password) });

    return res.status(201).json({ id: newUser.insertedId.toString(), email });
  }

  /**
   * Handles authenticated user retrieval.
   * @param {Object} req - Request object.
   * @param {Object} res - Response object.
   * @returns {Promise} - Promise that resolves to the user object if authenticated, or an error otherwise.
   */
  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);

    if (!user) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const userRecord = await dbClient.client.db().collection('users').findOne({ _id: mongoDBCore.BSON.ObjectId(user) });
    if (!userRecord) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    return res.status(200).json({ email: userRecord.email, id: userRecord._id.toString() });
  }
}

module.exports = UsersController;

