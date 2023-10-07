const express = require('express');
const router = express.Router();

const UploadController = require('../../controllers/uploadController/index.js');
const { validateVideoUpload, authorizeUser } = require('../middlewares');

// Route for uploading unedited video
router.post(
  '/upload',
  validateVideoUpload, // Middleware for input validation
  authorizeUser, // Middleware for authorization
  UploadController.uploadUneditedVideo
);

module.exports = router;
