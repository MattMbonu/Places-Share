const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Place = require("../models/places");
const User = require("../models/users");

const getCoordsForAddress = require("../utils/location-api/locations");

const HttpError = require("../models/http-error");

exports.getLocationByPlaceID = async (req, res, next) => {
  let place;

  try {
    place = await Place.findById({ _id: req.params.pid });
  } catch (error) {
    return next(
      new HttpError("Something went wrong could not find place", 500)
    );
  }

  if (!place) {
    return next(new HttpError("No Location Found", 404));
  }
  return res.json({ place: place.toObject({ getters: true }) });
};

exports.getLocationsByUserID = async (req, res, next) => {
  let locations;

  try {
    locations = await Place.find({ creator: req.params.uid });
  } catch (error) {
    return next(
      new HttpError("Something went wrong could not find places", 500)
    );
  }

  if (!locations || locations.length === 0) {
    return next(new HttpError("No Location(s) Found", 404));
  }
  return res.json({
    locations: locations.map((location) =>
      location.toObject({ getters: true })
    ),
  });
};

exports.createNewPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Please complete all fields", 422));
  }
  const { title, description, address, creator } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const newLocation = new Place({
    title,
    description,
    location: coordinates,
    address,
    image: "123",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);

    if (!user) {
      return next(new HttpError("Something went wrong", 500));
    }
  } catch (error) {
    return next(new HttpError("Something went wrong", 500));
  }
  try {
    // start session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newLocation.save({ session: sess });
    user.places.push(newLocation);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError("Something went wrong", 500));
  }
  return res
    .status(201)
    .json({ newLocation: newLocation.toObject({ getters: true }) });
};

exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("no update provided", 400));
  }
  const { title, description } = req.body;

  let selectedPlace;

  try {
    selectedPlace = await Place.findById({ _id: req.params.pid });
    selectedPlace.title = title;
    selectedPlace.description = description;

    await selectedPlace.save();
  } catch (error) {
    return next(error);
  }

  return res
    .status(200)
    .json({ place: selectedPlace.toObject({ getters: true }) });
};

exports.deletePlace = async (req, res, next) => {
  let place;
  try {
    place = await Place.findById(req.params.pid).populate("creator");
    if (!place) {
      return next(new HttpError("Could not find place with provided id", 404));
    }
  } catch (error) {
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    sess.commitTransaction();
  } catch (error) {
    return next(error);
  }

  return res.status(200).json({ place });
};
