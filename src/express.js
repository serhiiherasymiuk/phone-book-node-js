const express = require("express"),
  app = express();

const fs = require("fs");

const address = "127.0.0.1";
const port = 5567;

app.get("/api/welcome", (req, res) => {
  res
    .status(200)
    .type("text")
    .send("Welcome to API developed using Node.js Express.");
});

app.listen(port, address, () => {
  console.log(`Server is listening http://${address}:${port}`);
});