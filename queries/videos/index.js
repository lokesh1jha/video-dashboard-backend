const Video = require("../../models/youtubeVideo");

exports.saveVideo = async (videoData) => {
    const newVideo = new Video(videoData);
    return newVideo.save();
};

