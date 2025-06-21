const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

//When an Item is created
const clothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
        return value;
      }),
  }),
});

// When a User is created
const userInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
        return value;
      }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// When a User logs in
const userAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const itemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24),
  }),
});

module.exports = { clothingItem, userInfo, userAuth, itemId };
