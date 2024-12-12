/**
 * This module provides a DBClient class to interact with a MongoDB database.
 * @module DBClient
 */

const { MongoClient } = require('mongodb');

/**
 * DBClient class encapsulates the functionality to interact with MongoDB.
 * @class
 */
class DBClient {
  /**
   * Creates a new DBClient instance and connects to the MongoDB server.
   * The connection details are taken from environment variables, with defaults.
   * @constructor
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * Checks if the MongoDB client is connected.
   * @returns {boolean} true if the client is connected, false otherwise.
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Gets the number of user documents in the users collection.
   * @returns {Promise<number>} Promise that resolves to the number of user documents.
   */
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Gets the number of file documents in the files collection.
   * @returns {Promise<number>} Promise that resolves to the number of file documents.
   */
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }
}

// Create a singleton DBClient instance
const dbClient = new DBClient();

module.exports = dbClient;
