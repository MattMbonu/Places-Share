const { v4: uuid } = require("uuid");

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

function makeUsers() {
  let users = [];
  for (let i = 0; i < 1000; i++) {
    users.push({ uid: i, name: `matther number ${i}` });
  }
  return users;
}

const DUMMY_USERS = makeUsers();

exports.getUsers = (req, res, next) => {
  return res.json({ users: DUMMY_USERS });
};

exports.signupUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Please fill in all provided fields ", 400));
  }
  const { name } = req.body;

  const newUser = { uid: uuid(), name };
  DUMMY_USERS.push(newUser);
  return res.status(201).json(newUser);
};

exports.loginUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("No credentials provided ", 400));
  }
  const { name } = req.body;

  const user = DUMMY_USERS.find((user) => user.name === name);
  if (!user) {
    return next(new HttpError("Incorrect credentials", 400));
  }
  return res.status(200).json({ user });
};
