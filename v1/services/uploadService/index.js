const { google } = require('googleapis');
const AWS = require('aws-sdk');
const { saveToDB, getVideoMetaDataById } = require('../../../queries/video');

// Set up AWS S3 and YouTube Data API clients
const s3 = new AWS.S3();

const getVideoMetaData = async (videoId, ownerId) => {
    let resp = { status: 200, message: "" }

    try {
        let result = await getVideoMetaDataById(videoId);
        resp.status = result.status;
        resp.data = result;
    } catch (error) {
        resp.status = 500;
        resp.message = error.message;
    }
    return resp;

}

const uploadVideoToYoutube = async (s3Url, title, description, tags) => {
    let resp = { status: 200, message: '' };
    try {


        //specific youtube access to be fecthed for the user
        const youtube = google.youtube({ version: 'v3', auth: 'YOUR_YOUTUBE_API_KEY' });


        // Download video from S3
        const videoData = await s3.getObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: process.env.AWS_S3_KEY
        }).promise();
        const video = videoData.Body;

        // Upload video to YouTube
        const res = await youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: title,
                    description: description,
                    tags: tags
                },
                status: {
                    privacyStatus: 'private' // You can change this to public if needed
                }
            },
            media: {
                body: video
            }
        });

        return res.data.id;
    } catch (error) {

    }

}


const saveUploadedVideoDetails = async (s3Url, title, description, tags,thumbnail, uploadedBy, ownerId) => {
    let resp = { status: 200, message: 'Uploaded video metadata saved' };

    try {
        let data = {
            filePath: s3Url,
            title: title,
            description: description,
            tags: tags,
            thumbnail: thumbnail,
            uploadedBy: uploadedBy,
            ownerId: ownerId
        }
        let result = await saveToDB(data)
        resp.status = result.status
        resp.message = result.message
    } catch (error) {
        resp.status = 500
        resp.message = error.message
    }

    return resp
}

module.exports = {
    uploadVideoToYoutube,
    saveUploadedVideoDetails,
    getVideoMetaData
};
