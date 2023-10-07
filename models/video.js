const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  filePath: { type: String, required: true }, // Path to the uploaded video file
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming a User model
  // Add other video properties as needed
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
