const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUri: { type: String },
    code: { type: String }
}, { timestamps: true });

const credential = mongoose.model('Credential', credentialSchema);

module.exports = credential;
