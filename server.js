// This will allow the rest of your app to access the variables defined in your .env file.
require("dotenv").config();

// Create Express App
const express = require("express");
const app = express();
const PORT = 3000;

// Logging Middleware
app.use(require("morgan")("dev"));
// Javascript Object Notation Parsing
app.use(express.json());

// Import API Router and routes
app.use(require("./api/auth").router);
app.use("/playlists", require("./api/playlists"));
app.use("/tracks", require("./api/tracks"));

// 404 message
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something broke :(");
});

// Listening Port on 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
