const YoutubeVideo = require('../../models/YoutubeVideo');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;


//controller to upload 
const uploadUneditedVideo = async (req, res) => {
  try {
    // const uploadedFile = await UploadService.uploadFile(req.file);

    // const newVideo = await VideoService.createVideo({
    //   title: req.body.title,
    //   description: req.body.description,
    //   filePath: uploadedFile.path,
    //   // Add other video properties as needed
    // });

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

// const { uploadVideoToYoutube } = require('./youtubeService');

const uploadToYoutube = async (req, res) => {
  try {
   
    res.status(200).json({ urlToReDirect: authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ message: 'Failed to generate auth URL' });
  }
  // try {
  //   // Process and save video details to MongoDB
  //   const video = new YoutubeVideo(req.body);
  //   await video.save();
  //   res.status(201).json({ message: 'Video uploaded successfully' });
  // } catch (error) {
  //   console.error('Error uploading video:', error);
  //   res.status(500).json({ message: 'Failed to upload video' });
  // }
}

const youtubeAuthSaveCredentials = async (req, res) => {
  try {
    const { code } = req.body;
    const oauth2Client = new OAuth2();
    oauth2Client.setCredentials({
      access_token: code
    });
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });
    // Process and save video details to MongoDB
    const video = new YoutubeVideo(req.body);
    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ message: 'Failed to upload video' });
  }
}

module.exports = {
  uploadUneditedVideo,
  uploadToYoutube
};
