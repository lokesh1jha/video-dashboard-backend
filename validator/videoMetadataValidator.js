const Joi = require('joi');

const VideoMetadataSchema = Joi.object({
    title: Joi.string().trim().required().messages({
        'any.required': 'Title is required',
        'string.empty': 'Title cannot be empty',
    }),
    description: Joi.string().trim().required().messages({
        'any.required': 'Description is required',
        'string.empty': 'Description cannot be empty',
    }),
    language: Joi.string().trim().required().messages({
        'any.required': 'Language is required',
        'string.empty': 'Language cannot be empty',
    }),
    visibility: Joi.string().trim().required().messages({
        'any.required': 'Visibility is required',
        'string.empty': 'Visibility cannot be empty',
    }),
    tags: Joi.string().trim().required().messages({
        'any.required': 'Tags are required',
        'string.empty': 'Tags cannot be empty',
    }),
});

// TODO: check for video and thhumbnail(optional)
// TODO: may add more optional properties
const videoMetadataValidator = (req, res, next) => {
  const { error } = VideoMetadataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map(err => err.message) });
  }
  next();
};

module.exports = videoMetadataValidator;
