const { v4: uuid } = require("uuid");

const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

const User = require("../models/users");

const HttpError = require("../models/http-error");

function makeUsers() {
  let users = [];
  for (let i = 0; i < 1000; i++) {
    users.push({
      id: i,
      name: `matther number ${i}`,
      email: `matt${i}@deffnotfake.com`,
      password: "abcabc",
    });
  }
  return users;
}

exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  return res.json({ users });
};

exports.signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Please fill in all provided fields ", 422));
  }
  const { name, email, password } = req.body;

  // see if user exists
  let user = await User.findOne({ email });
  if (user) {
    return next(new HttpError("User already exists", 400));
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ name, email, password: encryptedPassword });
  await newUser.save();
  return res.status(201).json(newUser);
};

exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("No credentials provided ", 400));
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new HttpError("Incorrect credentials", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new HttpError("Incorrect credentials", 400));
    }
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};
