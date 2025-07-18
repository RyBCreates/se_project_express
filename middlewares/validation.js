const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Custom URL validator using validator.js
const validateURL = (value, helpers) => {
  if (validator.isURL(value, { require_protocol: true })) {
    return value;
  }
  return helpers.error("string.uri");
};

// Validate creating a clothing item
const validateCreateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
      "any.required": 'The "name" field is required',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
      "any.required": 'The "imageUrl" field is required',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "any.required": 'The "weather" field is required',
      "any.only": 'The "weather" field must be one of: hot, warm, cold',
    }),
  }),
});

// Validate user signup
const validateUserSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
      "any.required": 'The "name" field is required',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
      "any.required": 'The "avatar" field is required',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "any.required": 'The "email" field is required',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
      "any.required": 'The "password" field is required',
    }),
  }),
});

// Validate user login
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "any.required": 'The "email" field is required',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
      "any.required": 'The "password" field is required',
    }),
  }),
});

// Validate item ID in route params
const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.hex": "Item ID is not the correct format",
      "string.length": "Item ID must be 24 characters long",
      "any.required": "Item ID is required",
    }),
  }),
});

// Validate user login
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid URL',
      "any.required": 'The "avatar" field is required',
    }),
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
      "any.required": 'The "name" field is required',
    }),
  }),
});

module.exports = {
  validateCreateClothingItem,
  validateUserSignup,
  validateUserLogin,
  validateItemId,
  validateUserUpdate,
};
