/**
 * This file contains the main application routes.
 * @module routes/index
 * @author Javlon Tursunov
 * @license MIT
 */
const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

/**
 * Create a new instance of the Express router.
 * @type {Object}
 */
const router = express.Router();

/**
 * Handle GET requests to /status.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise} - Promise that resolves to the status of the application.
 */
router.get('/status', AppController.getStatus);

/**
 * Handle GET requests to /stats.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise} - Promise that resolves to the statistics of the application.
 */
router.get('/stats', AppController.getStats);

/**
 * Handle POST requests to /users.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise} - Promise that resolves to the newly created user object.
 */
router.post('/users', UsersController.postNew);

/**
 * Handle GET requests to /users/me.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @returns {Promise} - Promise that resolves to the user object of the authenticated user.
 */
router.get('/users/me', UsersController.getMe);

module.exports = router;
