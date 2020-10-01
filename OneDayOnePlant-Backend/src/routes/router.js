const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authMiddleware = require("../middlewares/authenticationMiddleware");
const User = require("../models/user");

const plantsController = require("../controllers/plantsController");
const usersController = require("../controllers/userController");
const userController = require("../controllers/userController");

router.get("/plant/:plantId", authMiddleware, plantsController.getPlant);
router.get("/plants", authMiddleware, plantsController.getPlants);
router.get("/plantspage", authMiddleware, plantsController.getPlantsPage);
router.get("/draw", authMiddleware, plantsController.drawPlant);

router.post(
  "/login",
  [
    body("username").trim().notEmpty(),
    body("password").trim().isLength({ min: 8 }),
  ],
  usersController.login
);
router.post(
  "/signup",
  [
    body("username")
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject("Username already used");
          }
        });
      }),
    body("password").trim().isLength({ min: 8 }),
    body("email")
      .isEmail()
      .normalizeEmail()
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email address already exists");
          }
        });
      }),
  ],
  usersController.signup
);

router.get("/user/:userId", authMiddleware, usersController.getUser);

router.get("/verify/:token", userController.verifyEmail);

module.exports = router;
