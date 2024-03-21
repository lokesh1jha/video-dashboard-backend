const express = require('express');
const router = express.Router();

const UploadController = require('../../controllers/uploadController');
const youtubeCredControlller = require('../../controllers/youtubeAccount');
const { validateVideoUpload, authorize } = require('../../middleware/authorization.js');


router.post('/uploadtoyoutube',authorize,  UploadController.uploadToYoutube);
router.post('/saveyoutubedetails', authorize, youtubeCredControlller.youtubeAuthSaveCredentials);

module.exports = router;
