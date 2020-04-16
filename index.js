const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");

//#region router-imports
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");

//#endregion router-imports

//#region App setup
const app = express();

app.use(express.json());

//#endregion

//#region routes
app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

//#endregion routes

//#region Not Found

app.use((req, res, next) => {
  next(new HttpError("Could not find this route.", 404));
});

//#endregion

//#region error handling

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  return res
    .status(error.code || 500)
    .json({ message: error.message || "an unknown error occured" });
});

//#endregion error handling

//#region Server Initialization

mongoose
  .connect(process.env.DB_CONNECTION_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    mongoose.connection.db.listCollections().toArray(function (err, names) {
      if (err) {
        console.log(err);
      } else {
        for (i = 0; i < names.length; i++) {
          console.log(names[i].name);
        }
      }
    });
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`app running on port ${PORT}`));
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

//#endregion Server Initialization
