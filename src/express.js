const express = require("express"),
  app = express();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://sgerasimuk07:6r7MqMoANySlVR5Y@cluster0.jr0y54t.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

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

app.get("/api/random-contact", (req, res) => {
  fs.readFile("src/contacts.json", (err, data) => {
    if (err) {
      res.status(500).type("text").send(err.message);
    } else {
      const contacts = JSON.parse(data);

      if (contacts.length === 0) {
        res.status(404).type("text").send("No contacts found.");
        return;
      }

      const randomIndex = Math.floor(Math.random() * contacts.length);
      const randomContact = contacts[randomIndex];

      res.status(200).type("json").send(randomContact);
    }
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

app.delete("/api/contacts/:name", (req, res) => {
  const name = req.params.name;

  fs.readFile("src/contacts.json", (err, data) => {
    if (err) {
      res.status(500).type("text").send(err.message);
    } else {
      let contacts = JSON.parse(data);

      const filteredContacts = contacts.filter(
        (contact) => contact.name !== name
      );

      if (filteredContacts.length === contacts.length) {
        res.status(404).type("text").send(`Contact ${name} not found.`);
        return;
      }

      fs.writeFile(
        "src/contacts.json",
        JSON.stringify(filteredContacts),
        (err) => {
          if (err) {
            res.status(500).type("text").send(err.message);
          } else {
            res
              .status(200)
              .type("text")
              .send(`Contact ${name} deleted successfully.`);
          }
        }
      );
    }
  });
});

app.listen(port, address, () => {
  console.log(`Server is listening http://${address}:${port}`);
});
