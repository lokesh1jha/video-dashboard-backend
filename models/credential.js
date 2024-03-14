const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    user_id: { type: String},
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUri: { type: String },
    token: {type: String}
}, { timestamps: true });

const credential = mongoose.model('Credential', credentialSchema);

module.exports = credential;
