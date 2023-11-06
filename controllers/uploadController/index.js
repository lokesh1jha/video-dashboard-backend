const fs = require('fs');


//controller to upload 
const uploadUneditedVideo = async (req, res) => {
  try {
    // const uploadedFile = await UploadService.uploadFile(req.file);

    // const newVideo = await VideoService.createVideo({
    //   title: req.body.title,
    //   description: req.body.description,
    //   filePath: uploadedFile.path,
    //   // Add other video properties as needed
    // });

    return res.status(201).json({
      message: 'Unedited video uploaded successfully',
      video: newVideo,
    });
  } catch (error) {
    // Handle errors appropriately (e.g., send error response, log error, etc.)
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const uploadToYoutube = async (req, res) => {
  const { s3Url, title, description, tags } = req.body;

  try {
    // const videoId = await uploadVideoToYoutube(s3Url, title, description, tags);

    return res.status(200).json({ message: "Video uploaded to YouTube successfully", videoId });
  } catch (error) {
    console.error("Upload to YouTube Controller Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


const uploadEditedVideo = async (req, res) => {
  try {
    //upload video from req to s3 on frontend server
    const { s3Url, title, description, tags } = req.body;

    const videoId = await saveUploadedVideoDetails(s3Url, title, description, tags);

    return res.status(200).json({ message: "Video uploaded successfully", videoId });
  } catch (error) {
    console.error("Upload to YouTube Controller Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  uploadUneditedVideo,
  uploadToYoutube,
  uploadEditedVideo
};
