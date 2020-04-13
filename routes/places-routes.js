const express = require("express");
const { check } = require("express-validator");
const placesController = require("../controllers/places-controllers");
const router = express.Router();

router.get("/:pid", placesController.getLocationByPlaceID);

router.get("/user/:uid", placesController.getLocationsByUserID);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5, max: 2000 }),
    check("address").not().isEmpty(),
    check("creator").not().isEmpty(),
  ],
  placesController.createNewPlace
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5, max: 2000 }),
  ],
  placesController.updatePlace
);

router.delete("/:pid", placesController.deletePlace);

module.exports = router;
