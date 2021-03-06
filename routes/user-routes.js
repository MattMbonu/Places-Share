const express = require("express");

const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").isEmail(),
    check("password").not().isEmpty(),
  ],
  usersControllers.signupUser
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").not().isEmpty()],
  usersControllers.loginUser
);

module.exports = router;
