const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../middlewares/custom-errors");

// DELETE and DELETE utils/errors.js
// const {
//   BAD_REQUEST,
//   NOT_FOUND,
//   INTERNAL_SERVER_ERROR,
//   CONFLICT,
//   UNAUTHORIZED,
// } = require("../utils/errors");

// Get user by ID
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User Not Found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};

// Create new user
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userObj = user.toObject();

        delete userObj.password; // Remove password from the response
        return res.status(201).send(userObj);
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new BadRequestError("Invalid Data"));
        }
        if (err.code === 11000) {
          next(new ConflictError("Please use a vallid email"));
        } else {
          next(err);
        }
      })
  );
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const userObj = user.toObject();
      delete userObj.password; // Remove password from the response
      res.status(200).send({ token, user: userObj });
    })
    .catch((err) => {
      if (!email) {
        next(new BadRequestError("Email is required"));
      }
      if (!password) {
        next(new BadRequestError("Password is required"));
      }

      if (err.name === "Error") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User Not Found"));
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
