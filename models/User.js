const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:{type:String,unique:true},
    mobile:{type:String,unique:true},
    otp:{type:Number},

    // Add other user properties as needed
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
