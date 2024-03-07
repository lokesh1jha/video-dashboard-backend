const userModel = require('../models/user');


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


exports.findUserWithEmail = async (email) => {
    var resp = { status: 500, message: "" }
    try {
        let user_res = await userModel.find({ email: email });
        resp.status = user_res.length == 0 ? 200 : 400
        resp.data = user_res
        console.log(user_res.length, resp)
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
        const filter = { email: email };        
        const update = { $set: { otp: otp } };
        let result = await userModel.updateOne(filter, update);
        resp.status = 200
        resp.data = result.modifiedCount //modified count is 1
        return resp
    }
    catch (err) {
        console.log("isUsersNameUnique Error: ", err.message)
        resp.message = err.message
        return resp
    }
}