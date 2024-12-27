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

let appointments = [
  { id: 1, time: "10:00 AM - 10:30 AM", available: true },
  { id: 2, time: "10:30 AM - 11:00 AM", available: true },
];
let workingHours = [
  { id: 1, time: "10:00 AM - 10:30 AM", available: true },
  { id: 2, time: "10:30 AM - 11:00 AM", available: true },
];

let tests = [
  {
    testId: "T001",
    testName: "Complete Blood Count (CBC)",
    description: "A CBC measures the levels of different cells in the blood.",
    price: 500,
    preparation: "No special preparation needed.",
    duration: "15 minutes",
  },
  {
    testId: "T002",
    testName: "Blood Glucose Test",
    description: "Measures the amount of glucose in the blood.",
    price: 300,
    preparation: "Fast for 8 hours before the test.",
    duration: "10 minutes",
  },
  {
    testId: "T003",
    testName: "Lipid Profile",
    description: "Measures the levels of different fats in the blood.",
    price: 700,
    preparation: "Fast for 12 hours before the test.",
    duration: "30 minutes",
  },
  {
    testId: "T004",
    testName: "Liver Function Test (LFT)",
    description:
      "Assesses the health of the liver by measuring levels of liver enzymes and proteins.",
    price: 600,
    preparation: "No special preparation needed.",
    duration: "20 minutes",
  },
  {
    testId: "T005",
    testName: "Thyroid Function Test (TFT)",
    description: "Evaluates the functioning of the thyroid gland.",
    price: 400,
    preparation: "No special preparation needed.",
    duration: "15 minutes",
  },
  {
    testId: "T006",
    testName: "Urinalysis",
    description: "Analyzes the content of urine for medical diagnosis.",
    price: 200,
    preparation: "No special preparation needed.",
    duration: "10 minutes",
  },
  {
    testId: "T007",
    testName: "Electrocardiogram (ECG)",
    description: "Records the electrical activity of the heart.",
    price: 800,
    preparation: "No special preparation needed.",
    duration: "30 minutes",
  },
  {
    testId: "T008",
    testName: "Chest X-ray",
    description:
      "Produces images of the chest to examine the lungs, heart, and chest wall.",
    price: 1000,
    preparation: "No special preparation needed.",
    duration: "20 minutes",
  },
  {
    testId: "T009",
    testName: "Magnetic Resonance Imaging (MRI)",
    description:
      "Uses strong magnetic fields to generate images of the inside of the body.",
    price: 5000,
    preparation:
      "Remove all metal objects and follow specific instructions given by the technician.",
    duration: "45 minutes to 1 hour",
  },
  {
    testId: "T010",
    testName: "Ultrasound",
    description:
      "Uses high-frequency sound waves to create images of the inside of the body.",
    price: 1500,
    preparation: "Drink plenty of water before the test.",
    duration: "30 minutes",
  },
];

// function findIndex(arr, id) {
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i].id === id) return i;
//   }
//   return -1;
// }

// function removeAtIndex(arr, index) {
//   let newArray = [];
//   for (let i = 0; i < arr.length; i++) {
//     if (i !== index) newArray.push(arr[i]);
//   }
//   return newArray;
// }

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

app.get("/appointments", (req, res) => {
  console.log("Appointments:", appointments);
  res.json(appointments);
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
