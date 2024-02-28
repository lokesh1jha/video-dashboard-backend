const Joi = require('joi');

const signupSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
  }),
  email: Joi.string().trim().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid email address',
    'string.empty': 'Email cannot be empty',
  }),
  password: Joi.string().trim().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password cannot be empty',
  }),
  user_type: Joi.string().trim().valid('client', 'service_provider').required().messages({
    'any.required': 'User type is required',
    'string.empty': 'User type cannot be empty',
    'any.only': 'Invalid user type',
  })
});

const signupValidator = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map(err => err.message) });
  }
  next();
};

module.exports = signupValidator;
