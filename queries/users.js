const userModel = require('../models/User');


exports.userStatus = async (userId) => {
    var resp = { status: 500, message: "" }
    try {
        let user_res = await userModel.findOne({ _id: userId });
        resp.status = 200
        resp.data = user_res.is_user_active == 1
        return resp
    } catch (err) {
        console.log(err.message)
        resp.message = err.message
        return resp
    }
}


exports.findUserWithMobileOrEmail = async (email, mobile) => {
    var resp = { status: 500, message: "" }
    try {
        let user_res = await userModel.find({ $or: [{ email: email }, { mobile: mobile }] });
        resp.status = 200
        resp.data = user_res.length > 0
        return resp
    } catch (err) {
        console.log(err.message);
        resp.message = err.message
        return resp
    }
};


exports.insertUser = async (data) => {
    var resp = { status: 500, message: "" }
    try {
        let res = await userModel.create(data);
        resp.status = 200
        resp.data = res
        return resp
    } catch (err) {
        console.log(err.message)
        resp.message = err.message
        return resp
    }
}

exports.findUsersByEmail = async (email) => {
    var resp = { status: 500, message: "" }
    try {
        let user_res = await userModel.findOne({ email: email });
        resp.status = 200
        resp.data = user_res
        return resp
    } catch (err) {
        console.log(err.message)
        resp.message = err.message
        return resp
    }
}

exports.isUsersNameUnique = async (userName) => {
    var resp = { status: 500, message: "" }
    try {
        let count = await userModel.count({ username: userName })
        resp.status = 200
        resp.data = count == 0
        return resp
    } catch (err) {
        console.log("isUsersNameUnique Error: ", err.message)
        resp.message = err.message
        return resp
    }
}

exports.saveOtpInDb = async (email, otp) => {
    var resp = { status: 500, message: "" }
    try {
        let result = await userModel.updateOne(email, otp)
        resp.status = 200
        resp.data = result
        return resp
    }
    catch (err) {
        console.log("isUsersNameUnique Error: ", err.message)
        resp.message = err.message
        return resp
    }
}