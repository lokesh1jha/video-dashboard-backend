const { isUsersNameUnique } = require("../queries/users");
const jwt = require('jsonwebtoken');

exports.generateOtp = () => {
    try {
        const otp = process.env.NODE_ENV === "production"
            ? Math.floor(1000 + Math.random() * 9000)
            : 9999;

        return otp
    } catch (err) {
        console.log(err.message)
        throw err
    }
}

exports.getUserName = async (email) => {
    try {
        let userName = email.split("@")[0]
        let isUserNameUnique = await isUsersNameUnique(userName)
        let count = 1
        while(!isUserNameUnique.data){
            userName += Math.floor(Math.random() * count)
            count *= Math.floor(Math.random() * 10) + 1
            isUserNameUnique = await isUsersNameUnique(userName)
        }
        return userName
    } catch (error) {
        console.log(error.message)
        throw error
    }
}


exports.generateToken = async (payload, expiresIn = '1h') => {
    try {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
    } catch (error) {
        console.log(error.message)
        throw error
    }
}

