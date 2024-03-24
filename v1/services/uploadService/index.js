const { getYouTubeCredentialsByUserId } = require('../../../queries/saveaccountdetails');
const { default: axios } = require('axios');
const { google } = require('googleapis');
const fs = require('fs');
const { logError } = require('../../../helpers/logger');
const { addVideoMetaData, getYoutubeMetaData } = require('../../../queries/videos/index.js');
const OAuth2Client = google.auth.OAuth2;
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const bucketName = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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



const uploadVideoToS3 = async (videoStream) => {
  try {
    const videoKey = `videos/edited/${uuidv4()}.mp4`;

    const params = {
      Bucket: bucketName,
      Key: videoKey,
      Body: videoStream,
      ContentType: 'video/mp4',
    };

    const uploadResult = await s3.upload(params).promise();

    return uploadResult.Location; // Return the S3 URL of the uploaded video
  } catch (error) {
    console.error('uploadVideoToS3 Error:', error);
    throw error;
  }
};


const uploadThumbnailToS3 = async (thumbnailStream) => {
    try {
      const thumbnailKey = `thumbnails/${uuidv4()}.jpg`;
  
      const params = {
        Bucket: bucketName,
        Key: thumbnailKey,
        Body: thumbnailStream,
        ContentType: 'image/jpeg', 
      };
  
      const uploadResult = await s3.upload(params).promise();
  
      return uploadResult.Location; 
    } catch (error) {
      console.error('uploadThumbnailToS3 Error:', error);
      throw error;
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
    uploadVideoToS3,
    uploadThumbnailToS3,
    saveVideoMetaDataService,
    fetchVideoMetaData
};
