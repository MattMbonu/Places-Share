const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const Place = require("../models/places");

const getCoordsForAddress = require("../utils/location-api/locations");

const HttpError = require("../models/http-error");

function makelocations() {
  let locations = [];
  for (let i = 0; i < 10; i++) {
    locations.push({
      id: `${i}`,
      title: `Eiffel number ${i}`,
      description: "my fav description",
      location: {
        lat: 40.7484474,
        lng: -73.9871516,
      },
      address: `my favoirte address number ${1}`,
      creator: `matt jumber ${i}`,
    });
  }
  return locations;
}

let DUMMY_LOCATIONS = makelocations();

exports.getLocationByPlaceID = async (req, res, next) => {
  const place = await Place.findById({ _id: req.params.pid });
  if (!place) {
    return next(new HttpError("No Location Found", 404));
  }
  return res.json({ place });
};

exports.getLocationsByUserID = async (req, res, next) => {
  const locations = await Place.find({ creator: req.params.uid });
  if (!locations) {
    return next(new HttpError("No Location Found", 404));
  }
  return res.json({ locations });
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
  });
  try {
    await newLocation.save();
  } catch (error) {
    return next(error);
  }
  return res.status(201).json({ newLocation });
};

exports.updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("no update provided", 400));
  }
  const { title, description } = req.body;

  const selectedIndex = DUMMY_LOCATIONS.findIndex(
    (location) => location.id == req.params.pid
  );
  const selectedPlace = DUMMY_LOCATIONS[selectedIndex];
  const updatedPlace = {
    ...selectedPlace,
    title,
    description,
  };

  DUMMY_LOCATIONS[selectedIndex] = updatedPlace;
  return res.status(200).json({ place: updatedPlace });
};

exports.deletePlace = (req, res, next) => {
  DUMMY_LOCATIONS = DUMMY_LOCATIONS.filter(
    (location) => location.id !== req.params.pid
  );
  return res.status(200);
};
