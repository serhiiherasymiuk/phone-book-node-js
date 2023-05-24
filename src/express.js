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

app.get("/api/contacts", (req, res) => {
  fs.readFile("src/contacts.json", (err, data) => {
    if (err) res.status(500).type("text").send(err.message);
    else res.status(200).type("json").send(data);
  });
});

app.post("/api/contacts/:name/:phone/:email", (req, res) => {
  const name = req.params.name;
  const phone = req.params.phone;
  const email = req.params.email;

  const newContact = {
    name: name,
    phone: phone,
    email: email,
  };

  fs.readFile("src/contacts.json", (err, data) => {
    if (err) {
      res.status(500).type("text").send(err.message);
    } else {
      let contacts = [];
      if (data) {
        contacts = JSON.parse(data);
      }
      contacts.push(newContact);
      fs.writeFile("src/contacts.json", JSON.stringify(contacts), (err) => {
        if (err) {
          res.status(500).type("text").send(err.message);
        } else {
          res
            .status(201)
            .type("text")
            .send(`Contact ${name} added successfully!`);
        }
      });
    }
  });
});

app.listen(port, address, () => {
  console.log(`Server is listening http://${address}:${port}`);
});
