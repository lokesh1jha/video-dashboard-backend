const express = require('express');
const router = express.Router();

const UploadController = require('../../controllers/uploadController/index.js');
const { validateVideoUpload, authorize } = require('../../middleware/authorization.js');



router.post('/uploadtoyoutube',authorize,  UploadController.uploadToYoutube);
router.post('/saveyoutubedetails', authorize, UploadController.youtubeAuthSaveCredentials);

module.exports = router;
