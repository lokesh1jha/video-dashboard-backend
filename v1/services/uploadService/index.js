const { google } = require('googleapis');
const { getYouTubeCredentialsByUserId } = require('../../../queries/saveaccountdetails');
const { getYouTubeCredentials } = require('../../../helpers/youtube');
const { default: axios } = require('axios');


const uploadVideoToYoutube = async (title, description, videoURL, user_id) => {
    try {
      // Download the video file from Cloudinary
      const response = await axios.get(videoURL, { responseType: 'stream' });
      const videoStream = response.data;
  
      // Get YouTube credentials by user ID
      let credential = await getYouTubeCredentialsByUserId(user_id);
      if (credential.status !== 200) {
        return { status: 400, message: "Credentials not found" };
      }
      const { clientId, clientSecret, redirectUrl, code } = credential.data;
      var oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
  
      // Get the access token from the saved credentials
      const token = await getYouTubeCredentials(clientId, clientSecret, code, redirectUrl);
      const credentials = JSON.parse(token);
      oauth2Client.credentials = credentials;
  
      const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client,
      });
  
      // Video Metadata
      const video = {
        snippet: {
          title: title,
          description: description,
          categoryId: '22', // Replace with the appropriate category ID
        },
        status: {
          privacyStatus: 'private', // You can set this to 'public' or 'unlisted' as well
        },
      };
  
      // Upload the video
      const result = await youtube.videos.insert({
        part: 'snippet,status',
        resource: video,
        media: {
          body: videoStream,
        },
      });
  
      // Return the result data
      return result.data;
    } catch (error) {
      console.error('Error uploading video to YouTube:', error);
      throw error;
    }
  };
  

module.exports = { uploadVideoToYoutube };
