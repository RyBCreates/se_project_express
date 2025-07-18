const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  InternalServerError,
} = require("../utils/errors/errors");

// Get user by ID
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(
        err.statusCode
          ? err
          : new InternalServerError("An error has occurred on the server")
      );
    });
};

// Create new user
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next(
      new BadRequestError(
        `Missing required fields: ${!name ? "name" : ""} ${
          !avatar ? "avatar" : ""
        } ${!email ? "email" : ""} ${!password ? "password" : ""}`.trim()
      )
    );
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
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data passed to create user"));
      }
      return next(
        new InternalServerError("An error has occurred on the server")
      );
    });
};

// Login User
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Both email and password are required"));
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
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(new InternalServerError("An error occurred on the server"));
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
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data passed for update"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      return next(new InternalServerError("An error occurred on the server"));
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  loginUser,
  updateCurrentUser,
};
