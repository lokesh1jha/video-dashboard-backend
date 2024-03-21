const { logError } = require("../../helpers/logger");
const { generateToken } = require("../../helpers/utils");
const { getYouTubeCredentials } = require("../../helpers/youtube");
const { isCredentialsPresent, updateCredentials, saveYouTubeCredentials, getYouTubeCredentialsByUserId, activateUserYoutubeAccess } = require("../../queries/saveaccountdetails");
const { findUserByUserId } = require("../../queries/users");




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
            //new token to be send
            let resp = await findUserByUserId(req.loggedInUser.userId)
            console.log(resp, "reslknlknlknlk")
            const { _id, email, username, user_type, is_youtube_authenticated } = resp;
            const payload = { userId: _id, email, username, user_type, is_youtube_authenticated };
            const token = await generateToken(payload);
            return res.status(201).json({ token, message: 'YouTube credentials updated successfully' });
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
    youtubeAuthSaveCredentials
}