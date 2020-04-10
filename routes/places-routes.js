const express = require("express");
const { check } = require("express-validator");
const placesController = require("../controllers/places-controllers");
const router = express.Router();

router.get("/:pid", placesController.getLocationsByPlaceID);

router.get("/user/:uid", placesController.getLocationsByUserID);

router.post(
  "/",
  check("name").not().isEmpty(),
  placesController.createNewPlace
);

router.patch(
  "/:pid",
  check("name").not().isEmpty(),
  placesController.updatePlace
);

router.delete("/:pid", placesController.deletePlace);

module.exports = router;
