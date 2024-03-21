const YoutubeVideo = require('../../models/youtubeVideo');
const { uploadVideoToYoutube, uploadThumbnail, uploadVideoToCloud } = require('../../v1/services/uploadService');

const uploadRawVideo = async (req, res) => {
  try {
    // Process and save video details to MongoDB
    const newVideo = new YoutubeVideo(req.body);
    await newVideo.save();
    res.status(201).json({ message: 'Unedited video uploaded successfully', video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const uploadToYoutube = async (req, res) => {
  try {
    const { title, description, filePath } = req.body;
    const { userId } = req.loggedInUser;
    const videoMetadata = {
      title,
      description,
      language: 'en',
      visibility: 'private',
      tags: [],
      thumbnailURL: '',
    }
    const uploadedVideo = await uploadVideoToYoutube(videoMetadata, filePath, userId);

    // Update the video in the database with the YouTube video ID
    // await YoutubeVideo.findByIdAndUpdate({ youtubeVideoId: uploadedVideo.id });

    res.status(200).json({ message: 'Video uploaded to YouTube successfully', video: uploadedVideo });
  } catch (error) {
    console.error('Error uploading video to YouTube:', error);
    res.status(500).json({ message: 'Failed to upload video' });
  }
};


const uploadEditedVideo = async (req, res) => {
  try {
    const { title, description, language, visibility, tags } = req.body;
    if(req.files['video'] === undefined || req.files['thumbnail'] === undefined) {
      return res.status(400).json({ error: 'Missing video or thumbnail' });
    }

    const videoUploadResult = await uploadVideoToCloud(req.files['video'][0].stream);
    const thumbnailUploadResult = await uploadThumbnail(req.files['thumbnail'][0].stream);

    const videoData = {
      title,
      description,
      language,
      visibility,
      tags: JSON.parse(tags), // need to check this
      videoUrl: videoUploadResult.secure_url,
      thumbnailUrl: thumbnailUploadResult.secure_url
    };

    await videoService.saveVideo(videoData);

    res.status(200).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};




module.exports = {
  uploadRawVideo,
  uploadToYoutube,
  uploadEditedVideo
};