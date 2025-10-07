import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./db.js";
import notesRouter from "./routes/notes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/api/notes", notesRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;

connectDB(URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server listening on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Mongo connection failed:", err);
    process.exit(1);
  });
