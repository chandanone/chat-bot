import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//serve public files
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html on the root route

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/appointment/book", (req, res) => {
  const { patientName, doctorId, slotId, category } = req.body;
  // Find the slot and update its availability
  const slot = slots.find((s) => s.id === slotId);
  if (!slot) {
    return res.status(404).json({ error: "Slot not found" });
  }
  if (!slot.available) {
    return res.status(400).json({ error: "Slot already booked" });
  }
  slot.available = false;
  const newAppointment = { patientName, doctorId, slotId, category };
  appointments.push(newAppointment);
  console.log("New Appointment:", newAppointment);
  res.status(201).json({
    message: "Appointment booked successfully",
    appointment: newAppointment,
  });
});

app.get("/appointments", async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT * FROM Appointments");
    console.log("Appointments:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/working-hours", (req, res) => {
  console.log("Working-hours:", workingHours);
  res.json(workingHours);
});

app.get("/tests", (req, res) => {
  console.log("medical tests:", tests);
  res.json(tests);
});

app.post("/chat", (req, res) => {
  const username = req.body.message;

  // Validate username
  if (!username) {
    return res.status(400).json({
      message: "Sorry I could not recognize! Please enter patients name",
    });
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
