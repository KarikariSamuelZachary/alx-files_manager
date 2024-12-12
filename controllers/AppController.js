const db = require('../utils/db');
const redis = require('../utils/redis');

class AppController {
  static getStatus(req, res) {
    const status = {
      redis: redis.isAlive(),
      db: db.isAlive(),
    };
    res.json(status);
  }

  static async getStats(req, res) {
    const stats = {
      users: await db.nbUsers(),
      files: await db.nbFiles(),
    };
    res.json(stats);
  }
}

module.exports = AppController;
