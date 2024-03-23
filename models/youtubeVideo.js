const mongoose = require('mongoose');

const YoutubeVideo = new mongoose.Schema({
  user_id: { type: String, required: true },
  channel_name: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  language: { type: String},
  visibility: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  uploadedBy: { type: String },
}, { timestamps: true });

const Video = mongoose.model('yt_video', YoutubeVideo);

module.exports = Video;
