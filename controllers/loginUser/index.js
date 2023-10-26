const { signupService } = require('../../v1/services/authentication/index');
const loginService = require('./loginService');
const sendOTPService = require('./sendOTPService');
const verifyOTPService = require('./verifyOTPService');

const signupController = async (req, res) => {
    const { name, mobile, email } = req.body;

    try {
        const response = await signupService(name, mobile, email);

        if (response.status === 200) {
            // User registered successfully
            return res.status(200).json({ message: "Registration successful" });
        } else if (response.status === 400) {
            // User already registered
            return res.status(400).json({ message: response.message });
        }
    } catch (error) {
        console.error("Signup Controller Error: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const loginResponse = await loginService(email, password);

        if (loginResponse.status === 200) {
            // Login successful, send OTP
            const otp = await sendOTPService(email);

            // Send OTP to the user (replace with actual logic)
            // For example, you can send it via email or SMS
            console.log(`Sent OTP ${otp} to ${email}`);

            // Return OTP to the client (for demo purposes)
            return res.status(200).json({ message: "Login successful. OTP sent to your email.", otp });
        } else {
            return res.status(400).json({ message: loginResponse.message });
        }
    } catch (error) {
        console.error("Login Controller Error: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const verifyOTPController = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpResponse = await verifyOTPService(email, otp);

        if (otpResponse.status === 200) {
            // OTP verification successful
            return res.status(200).json({ message: "OTP verification successful" });
        } else {
            return res.status(400).json({ message: otpResponse.message });
        }
    } catch (error) {
        console.error("Verify OTP Controller Error: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    signupController,
    loginController,
    verifyOTPController
};

