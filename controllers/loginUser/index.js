const { generateToken } = require('../../helpers/utils');
const { signupService, loginService } = require('../../v1/services/authentication/index');


/**
 * Controller function for user signup.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Promise<void>} Promise that resolves when the function is finished
 */
const signupController = async (req, res) => {
    const { username, email, password, user_type } = req.body;
    try {
        const response = await signupService(username, password, email, user_type);

        if (response.status === 200) {
            return res.status(200).json({ status: 200, message: "Registration successful" });
        }
        res.status(400).json({ status: 400, message: response.message });

    } catch (error) {
        console.error("Signup Controller Error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


/**
 * Controller function for user login.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Promise<void>} It returns a promise with no specific value
 */
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const loginResponse = await loginService(email, password);

        if (loginResponse.status === 200) {
            const { _id, username, email, user_type } = loginResponse.data
            const payload = { userId: _id, email, username, user_type };
            const token = await generateToken(payload);
            return res.status(200).json({ message: "Login successful.", token: token });
        }
        res.status(400).json({ message: loginResponse.message });

    } catch (error) {
        console.error("Login Controller Error: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Controller function to verify OTP.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise} a Promise that resolves to the result of the OTP verification
 */
const verifyOTPController = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpResponse = await verifyOTPService(email, otp);

        if (otpResponse.status === 200) {
            return res.status(200).json({ message: "OTP verification successful" });
        }
        res.status(400).json({ message: otpResponse.message });

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

