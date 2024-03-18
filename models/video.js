const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {type: String},
  videoURL: { type: String, required: true }, 
  thumbnailURL: { type: String },
  uploadedBy: { type: String },
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
