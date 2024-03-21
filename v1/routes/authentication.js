const express = require('express');
const router = express.Router();
const { signupController, loginController, verifyOTPController } = require('../../controllers/loginUser/index');
const signupValidator = require('../../validator/signupValidator');
const loginValidator = require('../../validator/loginValidator');

router.post('/register',signupValidator, signupController);

router.post('/login', loginValidator, loginController);

router.post('/verifyotp', verifyOTPController)


module.exports = router;
