const Video = require("../../models/youtubeVideo");


const addVideoMetaData = async (videoData) => {
    const newVideo = await Video.create(videoData)
    return newVideo
}

const getYoutubeMetaData = async (videoId, user_id) => {
    const video = await Video.findOne({_id: videoId, user_id: user_id})
    return video
}

const getAllVideosUnderUser = async (userId) => {
    const videos = await Video.find({user_id: userId})
    return videos
}


module.exports = {
    addVideoMetaData,
    getYoutubeMetaData,
    getAllVideosUnderUser
}