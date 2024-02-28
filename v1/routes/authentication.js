const express = require('express');
const router = express.Router();
const { signupController, loginController, verifyOTPController } = require('../../controllers/loginUser/index');
const signupValidator = require('../../validator/signupValidator');

// Route for user registration
router.post('/register',signupValidator, signupController);

// Route for user login
router.post('/login', loginController);

//Route for verify otp
router.post('/verifyotp', verifyOTPController)


module.exports = router;
