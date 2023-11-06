const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    mobile: { type: String, unique: true },
    otp: { type: Number },
    is_premium: { type: Number, default: 0 },
    user_type: { type: String, enum: ["client", "editor"], default: null },
    is_user_active: {type: Number, default: 1},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
