const express = require('express');
const router = express.Router();
const { signupController, loginController, verifyOTPController } = require('../../controllers/loginUser/index');
const { authorize } = require('../../middleware/authorization');

// Route for user registration
router.post('/register', signupController);

// Route for user login
router.post('/login', loginController);

//Route for verify otp
router.post('/verifyotp', verifyOTPController)

// Route for user logout
// router.post('/logout', authorize, logoutUser);

// Route for getting user profile
// router.get('/profile', authorize, getUserProfile);


module.exports = router;
