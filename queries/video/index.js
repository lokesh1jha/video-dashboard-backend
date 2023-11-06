let videoModel = require('../../models/video');

exports.getVideoMetaDataById = async (id) => {
    let resp = { status: 500, message: '' };
    try {
        let response = await videoModel.findById(id);
        resp.status = 200;
        resp.data = response;
    } catch (error) {
        console.log(error);
        resp.message = error.message;
    }
    return resp;
}

exports.saveToDB = async (data) => {
    let resp = { status: 500, message: '' };
    try {
        let response = await videoModel.create(data);
        resp.status = 200;
        resp.data = response;
    } catch (error) {
        console.log(error);
        resp.message = error.message;
    }
    return resp;
}