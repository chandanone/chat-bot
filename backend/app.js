const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());

let appointments = [];

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

app.get("/appointments", (req, res) => {
  console.log("Appointments:", appointments);
  res.json(appointments);
});

app.post("/chat", (req, res) => {
  const username = req.body.username;

  // Validate username
  if (!username) {
    return res.status(400).json({ message: "Username is required!" });
  }

  // Greeting message
  const greetingMessage = `Good Morning, ${username}! How can I assist you today? Here are some quick links to help you:`;

  // Helpful links
  const helpfulLinks = {
    appointment: "http://localhost:3001/appointments",
    workingHours: "http://localhost:3001/working-hours",
    tests: "http://localhost:3001/tests",
  };

  // Response
  res.status(200).json({
    message: greetingMessage,
    links: helpfulLinks,
  });
});

// for all other routes, return 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found!" });
});

app.listen(3001, () => {
  console.log(`server listening on 3001`);
});
