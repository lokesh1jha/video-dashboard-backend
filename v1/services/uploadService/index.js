const { getYouTubeCredentialsByUserId } = require('../../../queries/saveaccountdetails');
const { default: axios } = require('axios');


const uploadVideoToYoutube = async (title, description, videoURL, user_id) => {
  try {
      // Download the video file from Cloudinary
      const response = await axios.get(videoURL, { responseType: 'stream' });
      const videoStream = response.data;

      // Get YouTube credentials by user ID
      let credential = await getYouTubeCredentialsByUserId(user_id);
      console.log("credential", credential)
      if (credential.status !== 200) {
          return { status: 400, message: "Credentials not found" };
      }
      const token = await getClientYoutubeToken(user_id)
      console.log(token)
      if (!token) {
          return { status: 400, message: "Token not found" };
      }

      // Set the token in the request headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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
      const result = await axios.post('https://www.googleapis.com/upload/youtube/v3/videos', video, {
          headers: {
              'Content-Type': 'application/json',
          },
          params: {
              part: 'snippet,status',
          },
          data: videoStream,
      });

      // Return the result data
      return result.data;
  } catch (error) {
      console.error('Error uploading video to YouTube:', error);
      throw error;
  }
};


module.exports = { uploadVideoToYoutube };
