const { v4: uuid } = require("uuid");

const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

const User = require("../models/users");

const HttpError = require("../models/http-error");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    return res.json({
      users: users.map((user) => user.toObject({ getters: true })),
    });
  } catch (error) {
    return next(new HttpError("Something went wrong", 500));
  }
};

exports.signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Please fill in all provided fields ", 422));
  }
  const { name, email, password } = req.body;

  // see if user exists
  try {
    let user = await User.findOne({ email });
    if (user) {
      return next(new HttpError("User already exists", 400));
    }
  } catch (error) {
    return next(new HttpError("Something went wrong", 500));
  }

  // hash password
  let newUser;
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    newUser = new User({
      name,
      email,
      password: encryptedPassword,
      places: [],
    });
    await newUser.save();
  } catch (error) {
    return next(new HttpError("Something went wrong", 500));
  }

  return res.status(201).json({ newUser: newUser.toObject({ getters: true }) });
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
      return next(new HttpError("Incorrect credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new HttpError("Incorrect credentials", 401));
    }
    return res.status(200).json({ user: user.toObject({ getters: true }) });
  } catch (error) {
    return next(new HttpError("Something went wrong", 500));
  }
};
