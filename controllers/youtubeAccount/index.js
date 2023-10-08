const { saveYoutubeDetails } = require('./youtubeService');

const saveYoutubeDetailsController = async (req, res) => {
    const { apiKey, channelId } = req.body;

    try {
        await saveYoutubeDetails(apiKey, channelId);
        
        return res.status(200).json({ message: "YouTube details saved successfully" });
    } catch (error) {
        console.error("Save YouTube Details Controller Error: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { saveYoutubeDetailsController };
