const express = require('express');
const router = express.Router();

const UploadController = require('../../controllers/uploadController');
const youtubeCredControlller = require('../../controllers/youtubeAccount');
const { authorize } = require('../../middleware/authorization.js');
const validateCredentials = require('../../validator/validateCredentials.js');


router.post('/uploadtoyoutube',validateCredentials, authorize,  UploadController.uploadToYoutube);
router.post('/uploadtocloud', authorize,  UploadController.uploadEditedVideo);

router.post('/saveyoutubedetails', authorize, youtubeCredControlller.youtubeAuthSaveCredentials);

module.exports = router;
