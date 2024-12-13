const express = require('express');
const appController = require('../controllers/AppController');
const usersController = require('../controllers/UsersController');
const authController = require('../controllers/AuthController');
const filesController = require('../controllers/FilesController');

const router = express.Router();

router.get('/status', appController.getStatus);
router.get('/stats', appController.getStats);
router.post('/users', usersController.postNew);
router.get('/connect', authController.getConnect);

router.get('/disconnect', authController.getDisconnect);
router.get('/users/me', usersController.getMe);
router.post('/files', filesController.postUpload);
router.get('/files/:id', filesController.getShow);
router.get('/files', filesController.getIndex);

module.exports = router;

