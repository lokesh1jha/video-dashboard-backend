const mongoose = require('mongoose');

// Define a schema for storing YouTube details in the database
const youtubeDetailsSchema = new mongoose.Schema({
    apiKey: { type: String, required: true },
    channelId: { type: String, required: true }
});

const YoutubeDetails = mongoose.model('YoutubeDetails', youtubeDetailsSchema);

const saveYoutubeDetails = async (apiKey, channelId) => {
    try {
        // Check if YouTube details for this user already exist in the database
        const existingDetails = await YoutubeDetails.findOne();

        if (existingDetails) {
            // If details exist, update them
            existingDetails.apiKey = apiKey;
            existingDetails.channelId = channelId;
            await existingDetails.save();
        } else {
            // If not, create a new record
            const newDetails = new YoutubeDetails({ apiKey, channelId });
            await newDetails.save();
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { saveYoutubeDetails };
