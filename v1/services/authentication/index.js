const { findUserWithMobileOrEmail, insertUser, findUsersByEmail } = require("../../../queries/users")
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

        if (isUserExists) {
            resp.message = "User Already Registered"
            return resp
        }
        //register user
        let otp = generateOtp()
        let username = await getUserName(email)
        let createUsers = await insertUser({ username, name, mobile, email, otp, user_type })
        console.log(createUsers)
        if (createUsers) {
            let emailBody = EmailTemplate.generateOtp(name, otp)
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

const loginService = async (email, password) => {
    var resp = { status: 400, message: "" }
    try {
        let user = await findUsersByEmail(email);

        if (!user) {
            resp.message = "User not found";
            return resp;
        }

        //need to compare using bycrypt <password will be saved using bycrypt>
        if (user.password === password) {
            resp.status = 200;
            resp.message = "Password match successful";
        } else {
            resp.message = "Invalid password";
        }

        return resp;
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
        const otp = generateOTP();

        //save otp to database for verification process

        // Simulated sending OTP via email, replace with actual implementation
        sendOTPEmail(user.email, otp);

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
        let user = await findUserByEmail(email);

        // if (!user) {
        //     resp.message = "User not found";
        //     return resp;
        // }

        if (user.otp === otp) {
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
    signupService
}
