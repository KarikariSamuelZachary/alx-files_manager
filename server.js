/*************  ✨ Codeium Command 🌟  *************/
/**
 * Main application file.
 * @module app
 */

const express = require('express');
const routes = require('./routes/index');

/**
 * Creates Express application instance.
 * @type {Object}
 */
const app = express();

/**
 * Port to listen on.
 * @type {number}
 */
const port = process.env.PORT || 5000;

/**
 * Enable JSON parsing of request body.
 */
app.use(express.json());

/**
 * Enable URL-encoded parsing of request body.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Mount routes at /.
 */
app.use('/', routes);

/**
 * Start server.
 */
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});

/******  33bf6f50-34ef-4f96-bac8-9913a65c8642  *******/
