const { google } = require('googleapis');

exports.getYouTubeCredentials = async (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, code, redirectUri) => {
  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  oAuth2Client.getToken(code, function(err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    console.log(token)
    return token;
  });
  console.log("oops")
//   const token = await oAuth2Client.getToken(code);
// console.log(token, "rfsfsfsfsfsf")
//   return token;
};


// exports.getAuthUrlForNewToken = (oauth2Client) => {
//   var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly',
//     'https://www.googleapis.com/auth/youtube']
//   var authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   });
//   console.log('Authorize this app by visiting this url: ', authUrl);
//   return authUrl
// }
