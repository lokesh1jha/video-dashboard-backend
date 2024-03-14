const credential = require("../../models/credential");

exports.saveYouTubeCredentials = async (data) => {
    var resp = { status: 500, message: "" }
    try {
        let res = await credential.create(data);
        resp.status = 200
        resp.data = res
        return resp
    } catch (err) {
        console.log(err.message)
        resp.message = err.message
        return resp
    }
}

exports.isCredentialsPresent = async (user_id) => {
    var resp = { status: 500, message: "" }
    try {
        let user_res = await credential.findOne({ user_id: user_id });
        resp.status = user_res && Object.keys(user_res).length ? 200 : 400;
        resp.data = user_res
        return resp
    } catch (err) {
        console.log(err.message)
        resp.message = err.message
        return resp
    }
}

exports.updateCredentials = async (data, userId) => {
    var resp = { status: 500, message: "" }
    try {
        let res = await credential.updateOne({ user_id: userId }, data);
        resp.status = 200
        resp.data = res
        return resp
    } catch (err) {
        console.log(err.message)
        resp.message = err.message
        return resp
    }
}

exports.getYouTubeCredentialsByUserId = async (user_id) => {
    var resp = { status: 500, message: "" }
    try {
        let user_res = await credential.findOne({ user_id: user_id });
        resp.status = user_res && Object.keys(user_res).length ? 200 : 400;
        resp.data = user_res ? user_res._doc : {}
        return resp
    } catch (err) {
        console.log(err.message)
        resp.message = err.message
        return resp
    }
}

exports.getClientYoutubeToken = async(userId) => {
    return await credential.findOne({user_id: userId})
}