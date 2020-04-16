const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 400 },
  description: { type: String, required: true, minlength: 5, maxlength: 2000 },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("Place", placeSchema);
