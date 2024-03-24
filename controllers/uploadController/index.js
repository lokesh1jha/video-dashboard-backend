const { logError } = require('../../helpers/logger');
const YoutubeVideo = require('../../models/youtubeVideo');
const { uploadVideoToYoutube, uploadThumbnailToS3, saveVideoMetaDataService, fetchVideoMetaData, uploadVideoToS3 } = require('../../v1/services/uploadService');

const uploadRawVideo = async (req, res) => {
  try {
    // Process and save video details to MongoDB
    const newVideo = new YoutubeVideo(req.body);
    await newVideo.save();
    res.status(201).json({ message: 'Raw video uploaded successfully', video: newVideo });
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
    const { title, description, language, visibility, tags, userId} = req.body;
    if(req.files['video'] === undefined || req.files['thumbnail'] === undefined) {
      return res.status(400).json({ error: 'Missing video or thumbnail' });
    }

    const videoUploadResult = await uploadVideoToS3(req.files['video'][0].stream);
    const thumbnailUploadResult = await uploadThumbnailToS3(req.files['thumbnail'][0].stream);

    const videoData = {
      user_id: userId,
      uploadedBy: req.loggedInUser.userId,
      title,
      description,
      language,
      visibility,
      tags: tags,
      videoUrl: videoUploadResult.secure_url,
      thumbnailUrl: thumbnailUploadResult.secure_url
    };

    await saveVideoMetaDataService(videoData);

    res.status(200).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    logError('Upload error in uploadEditedVideo controller:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

const getVideoMetaData = async (req, res) => {
try {
  const user_id = req.loggedInUser.userId;
  const videoId = req.params.videoId;

  // user_id => User X will not be able to access the video metadata of User Y
  const response = await fetchVideoMetaData(videoId, user_id);

  if (!response) {
    return res.status(404).json({ error: 'Video not found' });
  }

  res.status(200).json({ data: response , message: 'Video metadata fetched successfully'});
} catch (error) {
  logError('getVideoMetaData error:', error);
  res.status(500).json({ error: 'Failed to get video metadata' });
}
}

module.exports = {
  uploadRawVideo,
  uploadToYoutube,
  uploadEditedVideo,
  getVideoMetaData
};