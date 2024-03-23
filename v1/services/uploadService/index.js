const { getYouTubeCredentialsByUserId } = require('../../../queries/saveaccountdetails');
const { default: axios } = require('axios');
const { google } = require('googleapis');
const fs = require('fs');
const { logError } = require('../../../helpers/logger');
const { addVideoMetaData, getYoutubeMetaData } = require('../../../queries/videos/index.js');
const OAuth2Client = google.auth.OAuth2;

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadVideoToYoutube = async (videoMetadata, videoURL, user_id) => {
    try {
        // Download the video file from Cloudinary
        const response = await axios.get(videoURL, { responseType: 'stream' });
        const videoStream = response.data;

        const tempFilePath = `temp_video_${user_id}.mp4`;
        const tempFile = fs.createWriteStream(tempFilePath);
        videoStream.pipe(tempFile);

        // Wait for the video to be fully downloaded
        await new Promise((resolve, reject) => {
            videoStream.on('end', resolve);
            videoStream.on('error', reject);
        });

        tempFile.close();

        const result = await uploadVideo(videoMetadata, user_id, tempFilePath, fs);

        return result;
    } catch (error) {
        console.error('Error uploading video to YouTube:', error);
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        throw error;
    }
};

const uploadVideo = async (videoMetadata, user_id, videoFilePath, fs) => {
    try {

        const credentials = await getYouTubeCredentialsByUserId(user_id)
        const { clientId, clientSecret, redirectUri, token } = credentials.data;

        const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
        oAuth2Client.setCredentials({ refresh_token: JSON.parse(token).access_token });
        const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });

        const request = youtube.videos.insert(
            {
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title: videoMetadata.title,
                        description: videoMetadata.description,
                    },
                    status: {
                        privacyStatus: videoMetadata.visibility, // or 'public' or 'unlisted'
                    },
                },
                media: {
                    body: fs.createReadStream("./" + videoFilePath), // Path to your video file
                },
            },
            (err, res) => {
                if (err) {
                    console.error('Error uploading video:', err);
                    return;
                }
                console.log('Video uploaded successfully:', res.data);
                fs.unlinkSync(videoFilePath)
                return res.data;
            }
        );
    } catch (error) {
        logError("Error uploading video", error)
    }
    return "On Process to upload video"
}


const uploadVideoToCloud = async (videoStream) => {
    try {
        return cloudinary.uploader.upload_stream({ resource_type: 'video' }, (error, result) => {
            if (error) {
                throw error;
            }
            return result;
        }).end(videoStream);
    } catch (error) {
        logError("uploadVideoToCloud Error: ".error)
    }
};

const uploadThumbnail = async (thumbnailStream) => {
    try {
        return cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                throw error;
            }
            return result;
        }).end(thumbnailStream);
    } catch (error) {
        logError("uploadThumbnail Error: ".error)
    }
};

const saveVideoMetaDataService = async (videoData) => {
    try {
        const newVideo = await addVideoMetaData(videoData);
        return newVideo;
    } catch (error) {
        logError("saveVideoMetaDataService Error: ".error)
    }
}

const fetchVideoMetaData = async (videoId, user_id) => {
    try {
        const response = await getYoutubeMetaData(videoId, user_id)
        return response
    } catch (error) {
        logError("fetchVideoMetaData Error: ".error)
    }
}
module.exports = {
    uploadVideoToYoutube,
    uploadVideoToCloud,
    uploadThumbnail,
    saveVideoMetaDataService,
    fetchVideoMetaData
};
