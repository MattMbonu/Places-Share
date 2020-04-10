const axios = require("axios");
const { API_KEY } = require("./keys");

async function getCoordsForAddress(address) {
  return axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${
      (1600 + Amphitheatre + Parkway, +Mountain + View, +CA)
    }&key=${API_KEY}`
  );
}
