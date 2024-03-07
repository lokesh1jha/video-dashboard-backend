// models/UneditedVideo.js
const mongoose = require('mongoose');

const uneditedVideoSchema = new mongoose.Schema({
  title: String,
  description: String,
  filePath: String,
});

const UneditedVideo = mongoose.model('UneditedVideo', uneditedVideoSchema);

module.exports = UneditedVideo;
