/**
 * This module exports the AppController class which handles requests to the
 * application endpoints.
 * @module AppController
 * @author Javlon Tursunov
 * @license MIT
 */

/**
 * Import modules
 */
const db = require('../utils/db');
const redis = require('../utils/redis');

/**
 * AppController class encapsulates the logic for handling application-related
 * requests.
 * @class
 */
class AppController {
  /**
   * Handles the GET /status request.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  static getStatus(req, res) {
    const status = {
      redis: redis.isAlive(),
      db: db.isAlive(),
    };
    res.json(status);
  }

  /**
   * Handles the GET /stats request.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {Promise<void>}
   */
  static async getStats(req, res) {
    const stats = {
      users: await db.nbUsers(),
      files: await db.nbFiles(),
    };
    res.json(stats);
  }
}

/**
 * Exports AppController class
 * @type {AppController}
 */
module.exports = AppController;

