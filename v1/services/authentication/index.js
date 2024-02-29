const { findUserWithEmail, insertUser, findUsersByEmail, saveOtpInDb } = require("../../../queries/users")
const { generateOtp, getUserName } = require("../../../helpers/utils")
const EmailTemplate = require("../../../helpers/emailers/template")
const EmailSession = require("../../../helpers/emailers/emailSession")
const { hashPassword } = require("../../../helpers/hashing")


/**
 * Signup service function for registering a new user.
 *
 * @param {string} name - The name of the user
 * @param {string} password - The password of the user
 * @param {string} email - The email of the user
 * @param {string} user_type - The type of the user
 * @return {object} The response object containing status and message
 */
const signupService = async (name, password, email, user_type) => {
    var resp = { status: 400, message: "" }
    try {
        let isUserExists = await findUserWithEmail(email)

        if (isUserExists.status === 400) {
            resp.message = "User already registered with this Email id"
            return resp
        }

        let username = await getUserName(email)
        password = await hashPassword(password)
        let createUsers = await insertUser({ username, name, password, email, user_type })

        if (createUsers.status === 200) {
            resp.status = 200
            resp.message = "User registered successfully"
        }
        return resp
    } catch (error) {
        console.log("Signup Failure : ", error.message)
        resp.status = 500
        resp.message = "Internal Server Error"
        return resp
    }
}

/**
 * Asynchronous function for user login.
 *
 * @param {string} email - The email of the user
 * @return {object} The response object with status and message
 */
const loginService = async (email) => {
    var resp = { status: 400, message: "" }
    try {
        let user = await findUsersByEmail(email);
        if (user.data.length == 0) {
            resp.message = "User not registered";
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


/**
 * Asynchronous function to send OTP via email.
 *
 * @param {string} email - the email address to send OTP to
 * @return {object} response object with status and message
 */
const sendOTPService = async (email) => {
    var resp = { status: 400, message: "" }
    try {
        const otp = generateOtp();

        let saveOtpPromise = saveOtpInDb(email, otp)
        let subject = "OTP for Login"
        let optEmailBody = await EmailTemplate.generateOtpHtmlBody(email, otp)
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

/**
 * Verify the OTP for a given email address.
 *
 * @param {string} email - The email address to verify the OTP for
 * @param {string} otp - The OTP to verify
 * @return {object} An object containing the status and message of the OTP verification
 */
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
