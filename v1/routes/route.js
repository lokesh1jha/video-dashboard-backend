const express = require('express');
const router = express.Router();

const UploadController = require('../../controllers/uploadController/index.js');
const { validateVideoUpload, authorizeUser } = require('../../middleware/authorization.js');

// Route for uploading unedited video
// router.post(
//   '/upload',
//   validateVideoUpload, // Middleware for input validation
//   authorizeUser, // Middleware for authorization
//   UploadController.uploadUneditedVideo
// );


router.post('/uplodaedited', validateVideoUpload, authorizeUser, UploadController.uploadEditedVideo)
module.exports = router;
