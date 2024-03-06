const jwt = require("jsonwebtoken");
const moment = require("moment"); // Assuming you're using moment for date-time manipulation
const User = require("../models/User");
const Config = require("../helpers/Config");
const { userStatus } = require("../queries/users");

// Define resModel
const resModel = {
  Message: "",
  code: 0
};

/**
 * Function to authorize the request using JWT token.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next function to be called
 * @return {Promise} Promise that resolves when authorization is successful
 */
const authorize = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) {
      resModel.Message =
        "Please make sure your request has an Authorization header";
      resModel.code = 401;
      return res.status(401).send(resModel);
    }
    const token = req.header("Authorization");
    let payload = null;
    try {
      payload = jwt.decode(token, Config.TOKEN_SECRET);
      console.log(payload)
    } catch (err) {
      resModel.Message = err.message;
      return res.status(401).send(resModel);
    }
    if (payload.exp <= moment().unix()) {
      resModel.Message = "Token expired";
      return res.status(401).send(resModel);
    }
    const isUserLegit = await checkUserStatus(payload.userId);
    if (isUserLegit) {
      req.loggedInUser = payload;
      next();
    } else {
      return res.status(401).json({ message: "Access Denied" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ message: "Error Occurred During Execution" });
  }
};

const checkUserStatus = async (userId) => {
  try {
    let is_user_active = await userStatus(userId);
    return is_user_active.data;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

module.exports = { authorize };
