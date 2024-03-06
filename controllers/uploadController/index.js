const YoutubeVideo = require('../../models/YoutubeVideo');
const { google, Auth } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Controller to upload an unedited video
const uploadUneditedVideo = async (req, res) => {
  try {
    // Process and save video details to MongoDB
    const newVideo = new YoutubeVideo(req.body);
    await newVideo.save();
    res.status(201).json({ message: 'Unedited video uploaded successfully', video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Service to upload video to YouTube
const uploadVideoToYoutube = async (videoId, title, description, filePath) => {
  try {
    const redirectUrl = 'http://localhost:5173/dashboard';
    const { clientId, clientSecret } = process.env; // Assuming you have set these environment variables

    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Get the access token from the saved credentials
    const credentials = JSON.parse(process.env.YOUTUBE_CREDENTIALS); // Assuming you have stored the credentials in an environment variable
    oauth2Client.credentials = credentials;

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    // Prepare the video metadata
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
    const response = await youtube.videos.insert({
      part: 'snippet,status',
      resource: video,
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    // Update the video in the database with the YouTube video ID
    await YoutubeVideo.findByIdAndUpdate(videoId, { youtubeVideoId: response.data.id });

    return response.data;
  } catch (error) {
    console.error('Error uploading video to YouTube:', error);
    throw error; 
  }
};

// Controller to upload video to YouTube
const uploadToYoutube = async (req, res) => {
  try {
    const { videoId, title, description } = req.body;
    const filePath = req.file.path; // Assuming you have a file upload middleware in place

    // Upload the video to YouTube
    const uploadedVideo = await uploadVideoToYoutube(videoId, title, description, filePath);

    // Update the video in the database with the YouTube video ID
    await YoutubeVideo.findByIdAndUpdate(videoId, { youtubeVideoId: uploadedVideo.id });

    res.status(201).json({ message: 'Video uploaded to YouTube successfully', video: uploadedVideo });
  } catch (error) {
    console.error('Error uploading video to YouTube:', error);
    res.status(500).json({ message: 'Failed to upload video' });
  }
};

// Function to save YouTube credentials
const youtubeAuthSaveCredentials = async (req, res) => {
  try {
    const redirectUrl = 'http://localhost:5173/dashboard';
    const { code, clientId, clientSecret } = req.body;

    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      const YOUTUBE_CREDENTIALS = JSON.stringify(token); 
      console.log("Main Cred", YOUTUBE_CREDENTIALS)
      res.status(201).json({ message: 'YouTube credentials saved successfully' });
    });
  } catch (error) {
    console.error('Error saving YouTube credentials:', error);
    res.status(500).json({ message: 'Failed to save credentials' });
  }
};

// const { google } = require('googleapis');

// const getYouTubeCredentials = async (code, redirectUri) => {
//   const oAuth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     redirectUri
//   );

//   const tokens = await oAuth2Client.getToken(code);

//   return tokens;
// };
// Export the functions
module.exports = {
  uploadUneditedVideo,
  uploadToYoutube,
  youtubeAuthSaveCredentials,
};