const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

function makelocations() {
  let locations = [];
  for (let i = 0; i < 1000; i++) {
    locations.push({
      uid: i,
      name: `empire state building number ${i}`,
      pid: i + 1,
    });
  }
  return locations;
}

let DUMMY_LOCATIONS = makelocations();

exports.getLocationsByPlaceID = (req, res, next) => {
  const locations = DUMMY_LOCATIONS.filter(
    (location) => location.pid === parseInt(req.params.pid)
  );
  if (!locations) {
    return next(new HttpError("No Location Found", 404));
  }
  return res.json({ locations });
};

exports.getLocationsByUserID = (req, res, next) => {
  const location = DUMMY_LOCATIONS.find(
    (location) => location.uid === parseInt(req.params.uid)
  );
  if (!location) {
    return next(new HttpError("No Location Found", 404));
  }
  return res.json(location);
};

exports.createNewPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Please complete all fields", 422));
  }
  const { name } = req.body;

  const newLocation = { uid: uuid(), name, pid: uuid() };
  DUMMY_LOCATIONS.push(newLocation);
  return res.status(201).json(newLocation);
};

exports.updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("no update provided", 400));
  }
  const { name } = req.body;

  const selectedIndex = DUMMY_LOCATIONS.findIndex(
    (location) => location.pid == req.params.pid
  );
  const selectedPlace = DUMMY_LOCATIONS[selectedIndex];
  const updatedPlace = { ...selectedPlace, name };

  DUMMY_LOCATIONS.splice(selectedIndex, 1, updatedPlace);
  return res.status(203).json({ place: updatedPlace });
};

exports.deletePlace = (req, res, next) => {
  DUMMY_LOCATIONS = DUMMY_LOCATIONS.filter(
    (location) => location.pid != req.params.pid
  );
  return res.status(200);
};
