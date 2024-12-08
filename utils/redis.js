import { createClient } from 'redis';

/**
 * A simplified Redis client wrapper.
 */
class RedisClient {
  /**
   * Initializes the Redis client.
   */
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Redis client connection error:', err.message || err);
    });

    this.client.connect().catch((err) => {
      console.error('Failed to connect to Redis:', err.message || err);
    });
  }

  /**
   * Checks if the Redis client is connected.
   * @returns {boolean}
   */
  isAlive() {
    return this.client.isOpen;
  }

  /**
   * Retrieves the value of a given key.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string | null>} - The value or null if not found.
   */
  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error(`Error retrieving key "${key}":`, err.message || err);
      return null;
    }
  }

  /**
   * Sets a key-value pair with an expiration time.
   * @param {string} key - The key to set.
   * @param {string | number | boolean} value - The value to store.
   * @param {number} duration - Expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    try {
      await this.client.setEx(key, duration, String(value));
    } catch (err) {
      console.error(`Error setting key "${key}":`, err.message || err);
    }
  }

  /**
   * Deletes a key from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error(`Error deleting key "${key}":`, err.message || err);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
