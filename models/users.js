const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 150 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  image: { type: String },
  places: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("user", userSchema);

module.exports = User;
