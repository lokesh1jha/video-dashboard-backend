const VideoModel = require('../models/Video'); // Assuming you have a Video model

const VideoService = {
  createVideo: async (videoData) => {
    try {
      const newVideo = await VideoModel.create(videoData);
      return newVideo;
    } catch (error) {
      throw new Error('Error creating video: ' + error.message);
    }
  },
};

module.exports = VideoService;
