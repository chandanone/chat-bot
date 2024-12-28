// Import required modules
require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

// Create an Express application
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

//serve public files
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html on the root route

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Configure PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Define request handlers
const getAppointments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Appointments");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getAppointmentStatus = async (req, res) => {
  const { appointment_id } = req.body;
  //const appointment_id = req.body.appointment_id;

  // Validate appointment_id
  if (!appointment_id) {
    return res.status(400).json({ error: "Invalid Appointment ID" });
  }

  try {
    const result = await pool.query(
      `SELECT 
        a.appointment_id, 
        a.patient_name, 
        d.name AS doctor_name, 
        a.appointment_time, 
        a.status 
      FROM 
        Appointments a 
      JOIN 
        Doctors d ON a.doctor_id = d.doctor_id 
      WHERE 
        a.appointment_id = $1`,
      [appointment_id]
    );

    // Check if appointment exists
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Return the appointment data
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const chat = (req, res) => {
  const username = req.body.message;

  // Validate username
  if (!username) {
    return res.status(400).json({
      message: "Sorry, I could not recognize! Please enter visitor's name.",
    });
  }

  // Greeting message
  const greetingMessage = `Good Morning, ${username}! How can I assist you today? Here are some quick links to help you:`;

  // Helpful links
  const helpfulLinks = {
    "appointment status": "http://localhost:3000/appointment-status",
    "working hours": "http://localhost:3000/working-hours",
    "medical tests": "http://localhost:3000/medical-tests",
  };

  // Response
  res.status(200).json({ message: greetingMessage, links: helpfulLinks });
};

const getWorkingHours = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM workinghours`);
    // Check if workinghours exists
    if (result.rowCount === 0) {
      return res.status(404).send({ error: "workinghours not found" });
    }
    // Return the workinghours data
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const getMedicalTests = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM medicaltests`);

    if (result.rowCount === 0) {
      return res.status(404).send({ error: "medical tests not found" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
// Define API endpoints
//app.get("/appointments", getAppointments);
app.post("/appointment-status", getAppointmentStatus);
app.get("/working-hours", getWorkingHours);
app.get("/medical-tests", getMedicalTests);
app.post("/chat", chat);

// Catch-all for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found!" });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
