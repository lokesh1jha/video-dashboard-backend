const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid email address',
    'string.empty': 'Email cannot be empty',
  }),
  password: Joi.string().trim().min(6).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password cannot be empty',
  })
});

const loginValidator = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map(err => err.message) });
  }
  next();
};

module.exports = loginValidator;
