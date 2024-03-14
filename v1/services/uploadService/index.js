const { getYouTubeCredentialsByUserId } = require('../../../queries/saveaccountdetails');
const { default: axios } = require('axios');
const { google } = require('googleapis');
const fs = require('fs');
const { logError } = require('../../../helpers/logger');
const OAuth2Client = google.auth.OAuth2;

const uploadVideoToYoutube = async (title, description, videoURL, user_id) => {
    try {
        // Download the video file from Cloudinary
        const response = await axios.get(videoURL, { responseType: 'stream' });
        const videoStream = response.data;

        // Create a temporary file to store the downloaded video
        const tempFilePath = `temp_video_${user_id}.mp4`;
        const tempFile = fs.createWriteStream(tempFilePath);
        videoStream.pipe(tempFile);

        // Wait for the video to be fully downloaded
        await new Promise((resolve, reject) => {
            videoStream.on('end', resolve);
            videoStream.on('error', reject);
        });

        // Close the temporary file
        tempFile.close();

        // Upload the video to YouTube
        const result = await uploadVideo(user_id, tempFilePath, fs);

        // delete temp file
        // fs.unlinkSync(tempFilePath);

        // Return the result data
        return result;
    } catch (error) {
        console.error('Error uploading video to YouTube:', error);
        throw error;
    }
};

const uploadVideo = async (user_id, videoFilePath, fs) => {
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
                        title: 'Test Video Title',
                        description: 'Test Video Description',
                    },
                    status: {
                        privacyStatus: 'private', // or 'public' or 'unlisted'
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
            }
        );
    } catch (error) {
        logError("Error uploading video", error)
    }
    return "On Process to upload video"
}

module.exports = { uploadVideoToYoutube };
