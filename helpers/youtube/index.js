const { google } = require('googleapis');

exports.getYouTubeCredentials = async (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, code, redirectUri) => {
  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const tokens = await oAuth2Client.getToken(code);

  return tokens;
};