require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const Student = require("./models/Student");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { autoIndex: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

/**
 * API: /api/students
 * - GET    /api/students?search=&page=1&limit=10
 * - GET    /api/students/:id
 * - POST   /api/students
 * - PUT    /api/students/:id
 * - DELETE /api/students/:id
 */

// List with basic search + pagination
app.get("/api/students", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const q = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { email: new RegExp(search, "i") },
            { phone: new RegExp(search, "i") },
            { className: new RegExp(search, "i") },
            { rollNo: new RegExp(search, "i") },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      Student.find(q)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      Student.countDocuments(q),
    ]);

    res.json({
      data: rows,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get single
app.get("/api/students/:id", async (req, res) => {
  try {
    const row = await Student.findById(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// Create
app.post("/api/students", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.name) return res.status(400).json({ error: "Name is required" });
    const created = await Student.create(payload);
    res.status(201).json(created);
  } catch (e) {
    // handle unique email, etc.
    res.status(400).json({ error: e.message });
  }
});

// Update
app.put("/api/students/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Serve admin UI
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
