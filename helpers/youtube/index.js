const { google } = require('googleapis');

exports.getYouTubeCredentials = async (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, code, redirectUri) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      redirectUri
    );
    return new Promise((resolve, reject) => {
      oAuth2Client.getToken(code, function (err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          reject(err);
        } else {
          token.expires_in = 3600; 
          console.log("token", token);
          resolve(token);
        }
      });
    })
      .then((token) => {
        return token;
      })
      .catch((err) => {
        console.log('Error:', err);
        return null;
      });
  }
  catch (err) {
    console.log(err)
    return null;
  }
};
