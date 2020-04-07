const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => `app running on port ${PORT}`);
