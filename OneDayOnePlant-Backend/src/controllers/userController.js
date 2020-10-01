const User = require("../models/user");
const { validationResult } = require("express-validator");
const logger = require("../utils/logger");
const authenticationService = require("../services/authenticationService");

module.exports = {
  login: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      error.message = "Invalid user credentials";
      next(error);
    }

    const username = req.body.username;
    const password = req.body.password;

    authenticationService
      .loginUser(username, password)
      .then(({ token, loadedUser }) => {
        res
          .status(200)
          .json({ token: token, userId: loadedUser._id.toString() });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        if (!err.message) {
          err.message = "Error on login";
        }
        logger.error(err);
        next(err);
      });
  },
  signup: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid credentials");
      error.statusCode = 422;
      error.data = errors.array();
      logger.error(errors);
      return next(error);
    }

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    authenticationService
      .signupUser(username, email, password)
      .then(({ token, user }) => {
        res.status(201).json({ userId: user._id });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        if (!err.message) {
          err.message = "Error on sign up";
        }
        next(err);
      });
  },
  getUser: (req, res, next) => {
    const userId = req.userId;
    User.findById(userId)
      .populate("lastDrawPlant")
      .populate("plants")
      .then((user) => {
        if (!user) {
          const error = new Error("Could not find user");
          error.statusCode = 401;
          throw error;
        }

        res.status(200).json({ user });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },
  verifyEmail: (req, res, next) => {
    authenticationService
      .confirmUser(req.params.token)
      .then((user) => {
        res.render("emailVerified", {
          link: process.env.FRONTEND_URL,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },
};
