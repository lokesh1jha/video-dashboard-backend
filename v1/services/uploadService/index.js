const { google } = require('googleapis');
const AWS = require('aws-sdk');

// Set up AWS S3 and YouTube Data API clients
const s3 = new AWS.S3();

//specific youtube access to be fecthed for the user
const youtube = google.youtube({ version: 'v3', auth: 'YOUR_YOUTUBE_API_KEY' });

const uploadVideoToYoutube = async (s3Url, title, description, tags) => {
    // Download video from S3
    const videoData = await s3.getObject({ Bucket: 'YOUR_S3_BUCKET_NAME', Key: 'YOUR_S3_VIDEO_KEY' }).promise();
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
}

module.exports = { uploadVideoToYoutube };
