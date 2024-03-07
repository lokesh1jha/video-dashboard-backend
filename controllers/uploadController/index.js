const YoutubeVideo = require('../../models/youtubeVideo');
const { google } = require('googleapis');
const { saveYouTubeCredentials, isCredentialsPresent, updateCredentials } = require('../../queries/saveaccountdetails');
const { uploadVideoToYoutube } = require('../../v1/services/uploadService');

const uploadRawVideo = async (req, res) => {
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


const uploadToYoutube = async (req, res) => {
  try {
    const { title, description, filePath } = req.body;
    const { userId } = req.loggedInUser;

    const uploadedVideo = await uploadVideoToYoutube(title, description, filePath, userId);

    // Update the video in the database with the YouTube video ID
    // await YoutubeVideo.findByIdAndUpdate({ youtubeVideoId: uploadedVideo.id });

    res.status(200).json({ message: 'Video uploaded to YouTube successfully', video: uploadedVideo });
  } catch (error) {
    console.error('Error uploading video to YouTube:', error);
    res.status(500).json({ message: 'Failed to upload video' });
  }
};

/**
 * Saves YouTube credentials for the logged-in user and handles updating or saving the credentials based on the user's existing credentials. 
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise<void>} - a Promise that resolves with the result of saving the YouTube credentials
 */
const youtubeAuthSaveCredentials = async (req, res) => {
  try {
    const { userId } = req.loggedInUser;
    if (!userId) {
      return res.status(400).json({ message: "User not found" });
    }

    const { code, clientId, clientSecret, redirectUrl } = req.body;

    // const token = await getYouTubeCredentials(clientId, clientSecret, code, redirectUrl);
    
    const data = {
      user_id: userId
    };
    
    if (clientId) {
      data.clientId = clientId;
    }
    
    if (clientSecret) {
      data.clientSecret = clientSecret;
    }
    
    if (redirectUrl) {
      data.redirectUri = redirectUrl;
    }
    
    if (code) {
      data.code = code;
    }
    

    const credRes = await isCredentialsPresent(userId);
    if (credRes.status === 200) {
      const updateResult = await updateCredentials(data);
      if (updateResult.status !== 200) {
        return res.status(400).json({ message: 'YouTube credentials failed to update' });
      }
      return res.status(201).json({ message: 'YouTube credentials updated successfully' });
    }

    const saveCredResponse = await saveYouTubeCredentials(data);
    if (saveCredResponse.status !== 200) {
      return res.status(400).json({ message: 'YouTube credentials failed to save' });
    }

    res.status(201).json({ message: 'YouTube credentials saved successfully' });

  } catch (error) {
    console.error('Error saving YouTube credentials:', error);
    res.status(500).json({ message: 'Failed to save credentials' });
  }
};



module.exports = {
  uploadRawVideo,
  uploadToYoutube,
  youtubeAuthSaveCredentials,
};