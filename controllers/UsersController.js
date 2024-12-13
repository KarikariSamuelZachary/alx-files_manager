/**
 * This module exports the UsersController class which handles all the user
 * related logic.
 * @module UsersController
 */

/**
 * Import the necessary modules.
 */
import sha1 from 'sha1';
import mongoDBCore from 'mongodb/lib/core';

/**
 * Import the necessary modules from the local project.
 */
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

/**
 * UsersController class encapsulates the logic for handling user-related
 * requests.
 * @class
 */
class UsersController {
  /**
   * Handles the POST /users request.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  static async postNew(req, res) {
    /**
     * Get the email and password from the request body.
     */
    const { email, password } = req.body;

    /**
     * Check if the email and password are missing.
     */
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    /**
     * Get the users collection from the MongoDB database.
     */
    const usersCollection = dbClient.client.db().collection('users');

    /**
     * Check if the user already exists in the database.
     */
    const user = await usersCollection.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }

    /**
     * Create a new user in the database with the given email and password.
     */
    const newUser = await usersCollection.insertOne({ email, password: sha1(password) });

    /**
     * Return the newly created user's ID and email.
     */
    return res.status(201).json({ id: newUser.insertedId.toString(), email });
  }

  /**
   * Handles the GET /users/me request.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  static async getMe(req, res) {
    /**
     * Get the token from the request headers.
     */
    const token = req.headers['x-token'];
    const key = `auth_${token}`;

    /**
     * Check if the token is missing.
     */
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /**
     * Get the user from the database using the user ID stored in Redis.
     */
    const user = await dbClient.client.db().collection('users').findOne({ _id: mongoDBCore.BSON.ObjectId(userId) });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    /**
     * Return the user's email and ID.
     */
    return res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}

/**
 * Export the UsersController class.
 */
module.exports = UsersController;


