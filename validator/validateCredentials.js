const Joi = require('joi');

// Validation schema for credentials
const CredentialsSchema = Joi.object({
    clientId: Joi.string().trim().required().messages({
        'any.required': 'Client ID is required',
        'string.empty': 'Client ID cannot be empty',
    }),
    clientSecret: Joi.string().trim().required().messages({
        'any.required': 'Client Secret is required',
        'string.empty': 'Client Secret cannot be empty',
    }),
    redirectUrl: Joi.string().trim().uri().required().messages({
        'any.required': 'Redirect URL is required',
        'string.empty': 'Redirect URL cannot be empty',
        'string.uri': 'Redirect URL must be a valid URI'
    })
});

// Validation schema for code
const CodeSchema = Joi.object({
    code: Joi.string().trim().required().messages({
        'any.required': 'Code is required',
        'string.empty': 'Code cannot be empty',
    })
});

// Middleware for validating credentials
const validateCredentials = (req, res, next) => {
    // Check if 'code' exists in the request body
    if (req.body.code) {
        // Validate using CodeSchema
        const { error } = CodeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
    } else {
        // Validate using CredentialsSchema
        const { error } = CredentialsSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ errors: error.details.map(err => err.message) });
        }
    }
    next();
};

module.exports = validateCredentials;
