const express = require("express");
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => `app running on port ${PORT}`);

//#endregion Server Initialization
