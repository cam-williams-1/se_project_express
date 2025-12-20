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

// Get all users
// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => {
//       console.error(err);
//       return res
//         .status(INTERNAL_SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// Get user by ID
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document Not Found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid Data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Create new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userObj = user.toObject();

        delete userObj.password; // Remove password from the response
        return res.status(201).send(userObj);
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(BAD_REQUEST).send({ message: "Invalid Data" });
        }
        if (err.code === 11000) {
          return res
            .status(CONFLICT)
            .send({ message: "Please use a valid email" });
        }
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      })
  );
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);

      if (!email) {
        return res.status(BAD_REQUEST).send({ message: "Email is required" });
      }
      if (!password) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Password is required" });
      }

      if (err.name === "Error") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User Not Found" });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid Data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
