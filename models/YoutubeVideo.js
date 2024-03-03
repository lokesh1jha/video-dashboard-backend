const mongoose = require('mongoose');

const YoutubeVideo = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  language: { type: String, required: true },
  visibility: { type: String, required: true },
});

const Video = mongoose.model('Video', YoutubeVideo);

module.exports = Video;
