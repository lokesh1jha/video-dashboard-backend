const YoutubeVideo = require('../../models/youtubeVideo');
const { google } = require('googleapis');
const { saveYouTubeCredentials, updateCredentials, getYouTubeCredentialsByUserId, isCredentialsPresent } = require('../../queries/saveaccountdetails');
const { uploadVideoToYoutube } = require('../../v1/services/uploadService');
const { logError, logInfo } = require('../../helpers/logger');
const { getYouTubeCredentials } = require('../../helpers/youtube');

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


const uploadEditedVideo = async (req, res) => {
  try {
    const { title, description, language, visibility, tags } = req.body;

    // Pass streams directly to service
    const videoUploadResult = await videoService.uploadVideo(req.files['video'][0].stream);
    const thumbnailUploadResult = await videoService.uploadThumbnail(req.files['thumbnail'][0].stream);

    const videoData = {
      title,
      description,
      language,
      visibility,
      tags: JSON.parse(tags),
      videoUrl: videoUploadResult.secure_url,
      thumbnailUrl: thumbnailUploadResult.secure_url
    };

    await videoService.saveVideo(videoData);

    res.status(200).json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
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

    if (clientId && clientSecret && redirectUrl) {
      let data = {
        user_id: userId,
        clientId: clientId,
        clientSecret: clientSecret,
        redirectUri: redirectUrl
      }
      const alreadyCredPresent = await isCredentialsPresent(userId)
      let saveCredResponse = null
      if (alreadyCredPresent.status === 200) {
        //update
        saveCredResponse = await updateCredentials(data, userId)
      }
      else {
        //insert
        saveCredResponse = await saveYouTubeCredentials(data);
      }
      if (saveCredResponse.status !== 200) {
        return res.status(400).json({ message: 'YouTube credentials failed to save' });
      }
    }
    else {
      // At this instance we have code , userId

      //Now, fetch left credentials details
      let credValues = await getYouTubeCredentialsByUserId(userId);

      if (credValues.status != 200) {
        return res.status(400).json({ message: "User's initial credentials not found" })
      }
      credValues = credValues.data
      const token = await getYouTubeCredentials(credValues.clientId, credValues.clientSecret, code, credValues.redirectUri);
      console.log("token", token)
      if (token) {
        let isSaved = await updateCredentials({ token: JSON.stringify(token) }, userId)
        let updateUserStatus = await activateUserYoutubeAccess(userId);
        if (isSaved.status === 200 && updateUserStatus.status === 200) {
          return res.status(201).json({ message: 'YouTube credentials updated successfully' });
        }
      }
      return res.status(400).json({ message: "Something went wrong" })
    }

    return res.status(201).json({ message: 'YouTube credentials saved successfully' });

  } catch (error) {
    logError("Error saving YouTube credentials: ", error)
  }
  res.status(500).json({ message: 'Failed to save credentials' });
};



module.exports = {
  uploadRawVideo,
  uploadToYoutube,
  youtubeAuthSaveCredentials,
  uploadEditedVideo
};