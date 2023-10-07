const fs = require('fs');

const UploadService = require('../services/UploadService');
const VideoService = require('../services/VideoService');

const uploadUneditedVideo = async (req, res) => {
  try {
    const uploadedFile = await UploadService.uploadFile(req.file);

    const newVideo = await VideoService.createVideo({
      title: req.body.title,
      description: req.body.description,
      filePath: uploadedFile.path,
      // Add other video properties as needed
    });

    return res.status(201).json({
      message: 'Unedited video uploaded successfully',
      video: newVideo,
    });
  } catch (error) {
    // Handle errors appropriately (e.g., send error response, log error, etc.)
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  uploadUneditedVideo,
};
