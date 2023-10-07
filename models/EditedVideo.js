// models/EditedVideo.js
const mongoose = require('mongoose');

const editedVideoSchema = new mongoose.Schema({
  title: String,
  description: String,
  filePath: String,
  editorId: String,
});

const EditedVideo = mongoose.model('EditedVideo', editedVideoSchema);

module.exports = EditedVideo;
