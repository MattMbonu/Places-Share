const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const Place = require("../models/places");

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
  const { title, description, address } = req.body;

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
  });
  try {
    await newLocation.save();
  } catch (error) {
    return next(error);
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
  try {
    await Place.findByIdAndDelete({ _id: req.params.pid });
  } catch (error) {
    return next(error);
  }
  return res.status(200);
};
