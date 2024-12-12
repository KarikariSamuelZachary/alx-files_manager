/**
 * This file contains the RedisClient class which encapsulates the
 * functionality of the Redis key-value store.
 * @module RedisClient
 * @author Javlon Tursunov
 * @license MIT
 */
const redis = require('redis');

/**
 * RedisClient class encapsulates the functionality of the Redis key-value store
 * @class
 * @property {Object} client - Redis client object
 * @property {boolean} connected - Whether Redis is connected or not
 */
class RedisClient {
  /**
   * Creates RedisClient object
   * @constructor
   */
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (error) => {
      console.error(error);
    });
  }

  /**
   * Returns whether Redis is connected or not
   * @returns {boolean} true if connected or false if not
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Retrieves the value by the given key from Redis
   * @param {string} key - Redis key
   * @returns {Promise} Promise that resolves to the value of the key
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, value) => {
        if (error) return reject(error);
        return resolve(value);
      });
    });
  }

  /**
   * Sets the value for the given key in Redis with a given TTL
   * @param {string} key - Redis key
   * @param {*} value - Value to set
   * @param {number} duration - TTL in seconds
   * @returns {Promise} Promise that resolves to the result of the operation
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (error, reply) => {
        if (error) return reject(error);
        return resolve(reply);
      });
    });
  }

  /**
   * Deletes the given key from Redis
   * @param {string} key - Redis key
   * @returns {Promise} Promise that resolves to the result of the operation
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, reply) => {
        if (error) return reject(error);
        return resolve(reply);
      });
    });
  }
}

/**
 * Creates RedisClient object
 * @type {RedisClient}
 */
const redisClient = new RedisClient();
/**
 * Exports RedisClient object
 * @type {RedisClient}
 */
module.exports = redisClient;
