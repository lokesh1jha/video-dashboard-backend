const express = require('express');
const router = express.Router();

const UploadController = require('../../controllers/uploadController/index.js');
const { validateVideoUpload, authorizeUser } = require('../../middleware/authorization.js');



router.post('/uploadtoyoutube', UploadController.uploadToYoutube);

module.exports = router;
