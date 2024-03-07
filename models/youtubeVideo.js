const mongoose = require('mongoose');

const YoutubeVideo = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  channel_name: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  language: { type: String},
  visibility: { type: String, required: true },
});

const Video = mongoose.model('Video', YoutubeVideo);

module.exports = Video;
