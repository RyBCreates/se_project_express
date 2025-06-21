const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

// Get user by ID
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next({ statusCode: BAD_REQUEST, message: "Invalid user ID" });
        // res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return next({ statusCode: NOT_FOUND, message: "User not found" });

        // res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return next({
        statusCode: INTERNAL_SERVER_ERROR,
        message: "An error has occurred on the server",
      });
      // res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

// Create new user
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next({
      statusCode: BAD_REQUEST,
      message: `Missing required fields: ${!name ? "name" : ""} ${
        !avatar ? "avatar" : ""
      } ${!email ? "email" : ""} ${!password ? "password" : ""}`.trim(),
    });
    // res.status(BAD_REQUEST).send({
    //   message: `Missing required fields: ${!name ? "name" : ""} ${
    //     !avatar ? "avatar" : ""
    //   } ${!email ? "email" : ""} ${!password ? "password" : ""}`.trim(),
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const { password: removed, ...userWithoutPassword } = user.toObject();
      res.send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next({
          statusCode: BAD_REQUEST,
          message: "Invalid data passed to create user",
        });
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: "Invalid data passed to create user" });
      }
      if (err.code === 11000) {
        return next({ statusCode: CONFLICT, message: "Email already exists" });
        // return res.status(CONFLICT).send({ message: "Email already exists" });
      }

      return next({
        statusCode: INTERNAL_SERVER_ERROR,
        message: "An error has occurred on the server",
      });
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

// Login User
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next({
      statusCode: BAD_REQUEST,
      message: "Both email and password are required",
    });
    //  res.status(BAD_REQUEST).send({
    //   message: "Both email and password are required",
    // });
  }

  return User.findUserByCredentials(email, password)
    .then((data) => {
      const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      const user = data.toObject();
      delete user.password;
      return res.send({ user, token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next({
          statusCode: UNAUTHORIZED,
          message: "Incorrect email or password",
        });

        // return res
        //   .status(UNAUTHORIZED)
        //   .send({ message: "Incorrect email or password" });
      }

      return next({
        statusCode: INTERNAL_SERVER_ERROR,
        message: "An error occurred on the server",
      });
      //   return res
      //     .status(INTERNAL_SERVER_ERROR)
      //     .send({ message: "An error occurred on the server" });
    });
};

const updateCurrentUser = (req, res, next) => {
  const { avatar, name } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { avatar, name },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next({ statusCode: NOT_FOUND, message: "User not found" });
        // return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next({
          statusCode: BAD_REQUEST,
          message: "Invalid data passed to update user",
        });
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: "Invalid data passed to update user" });
      }

      return next({
        statusCode: INTERNAL_SERVER_ERROR,
        message: "An error occurred on the server",
      });
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  loginUser,
  updateCurrentUser,
};
