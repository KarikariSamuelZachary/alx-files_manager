/**
 * This module exports the AuthController class which handles the
 * authentication logic.
 * @module AuthController
 * @author Karikari Samuel
 * @license MIT
 */
import sha1 from 'sha1';

/**
 * @typedef {Object} User
 * @property {string} email - Email of the user.
 * @property {string} _id - ID of the user.
 * @property {string} password - SHA1 hashed password of the user.
 */

/**
 * @typedef {Object} AuthController
 * @property {function(req, res): Promise<void>} getConnect - Handles the
 * GET /connect request.
 * @property {function(req, res): Promise<void>} getDisconnect - Handles the
 * GET /disconnect request.
 */

const uuid = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

/**
 * AuthController class encapsulates the authentication logic.
 * @class
 * @author Karikari Samuel
 * @license MIT
 */
class AuthController {
  /**
   * Handles the GET /connect request.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  static async getConnect(req, res) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [email, password] = Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':');
    const sha1password = sha1(password);

    const user = await dbClient.client.db().collection('users').findOne({ email });
    if (!user || sha1password !== user.password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuid.v4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 24 * 60 * 60);

    return res.status(200).json({ token });
  }

  /**
   * Handles the GET /disconnect request.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await redisClient.del(key);

    return res.status(204).send();
  }
}

module.exports = AuthController;
