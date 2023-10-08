const signupService = async (name, mobile, email, password) => {
    var resp = { status: 400, message: ""}
    try {
        let isUserExists = await findUserWithMobileOrEmail(mobile, email)
        if(isUserExists){
            resp.message = "User Already Registered"
            return resp;
        }

        //register user
    } catch (error) {
        console.log("Signup Failure : ", error.message)
        resp.status = 500
        resp.message = error.message
        return resp
    }
}

const loginService = async (email, password) => {
    var resp = { status: 400, message: "" }
    try {
        let user = await findUserByEmail(email);

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

