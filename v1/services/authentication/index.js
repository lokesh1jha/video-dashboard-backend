const { findUserWithMobileOrEmail, insertUser, findUsersByEmail, saveOtpInDb } = require("../../../queries/users")
const { generateOtp, getUserName } = require("../../../helpers/utils")
const EmailTemplate = require("../../../helpers/emailers/template")
const EmailSession = require("../../../helpers/emailers/emailSession")


const signupService = async (name, mobile, email, user_type) => {
    var resp = { status: 400, message: "" }
    try {

        if (!(mobile && email && name && user_type)) {
            resp.message = "Please Enter All Required Fields"
            resp.status = 400
            return resp
        }


        let isUserExists = await findUserWithMobileOrEmail(mobile, email)
        
        if (isUserExists.data) {
            resp.message = "User Already Registered"
            return resp
        }
        //register user
        let otp = generateOtp()
        let username = await getUserName(email)
        let createUsers = await insertUser({ username, name, mobile, email, otp, user_type })
        
        if (createUsers.status == 200) {
            let emailBody = EmailTemplate.generateOtpHtmlBody(name, otp)
            let toAddress = email
            await EmailSession.sendEmail(emailBody, toAddress, "OTP Verification",)
            resp.status = 200
            resp.message = "OTP generated Successfully"
        } else {
            resp.message = "Something Went Wrong"
        }


        return resp
    } catch (error) {
        console.log("Signup Failure : ", error.message)
        resp.status = 500
        resp.message = "Internal Server Error"
        return resp
    }
}

const loginService = async (email) => {
    var resp = { status: 400, message: "" }
    try {
        let user = await findUsersByEmail(email);

        if (user.data.length == 0) {
            resp.message = "User not found";
            return resp;
        }

        let response = await sendOTPService(email)

        return response;
    } catch (error) {
        console.log("Login Failure : ", error.message);
        resp.status = 500;
        resp.message = error.message;
        return resp;
    }
}


const sendOTPService = async (email) => {
    var resp = { status: 400, message: "" }
    try {
        const otp = generateOtp();

        let saveOtpPromise =  saveOtpInDb(email, otp)

        let optEmailBody = EmailTemplate.generateOtpHtmlBody(email, otp)
        let sendOtpPromise = EmailSession.sendEmail(email, subject, optEmailBody)

        await Promise.all[saveOtpPromise, sendOtpPromise]
        
        resp.status = 200;
        resp.message = "OTP sent successfully";
        return resp;
    } catch (error) {
        console.log("Sending OTP Failure : ", error.message);
        resp.status = 500;
        resp.message = error.message;
        return resp;
    }
}

const verifyOTPService = async (email, otp) => {
    var resp = { status: 400, message: "" }
    try {
        let user = await findUsersByEmail(email);

        if (!user.data.length) {
            resp.message = "User not found";
            return resp;
        }

        if (user.data.otp === otp) {
            resp.status = 200;
            resp.message = "OTP verification successful";
        } else {
            resp.message = "Invalid OTP";
        }

        return resp;
    } catch (error) {
        console.log("OTP Verification Failure : ", error.message);
        resp.status = 500;
        resp.message = error.message;
        return resp;
    }
}


module.exports = {
    signupService,
    loginService,
    sendOTPService,
    verifyOTPService
}
