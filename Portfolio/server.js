import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security & body parsing
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your portfolio)
app.use(express.static(path.join(__dirname, "public")));

// CORS (allow your site URL only)
app.use(
  cors({
    origin: process.env.SITE_URL || "http://localhost:" + PORT,
    methods: ["POST"],
  })
);

// Basic rate limit to avoid abuse
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // true for 465, false for 587/others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP at startup (helpful in dev)
transporter.verify((err, success) => {
  if (err) console.error("SMTP error:", err.message);
  else console.log("SMTP server is ready ✅");
});

// Validation rules
const validateContact = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name is required (2–100 chars)."),
  body("email").isEmail().withMessage("Valid email is required.").normalizeEmail(),
  body("subject").trim().isLength({ min: 3, max: 120 }).withMessage("Subject is required (3–120 chars)."),
  body("message").trim().isLength({ min: 10, max: 5000 }).withMessage("Message must be at least 10 characters."),
];

// Contact endpoint
app.post("/api/contact", contactLimiter, validateContact, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;

  const html = `
    <h2>New Portfolio Contact</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <hr/>
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html,
    });

    return res.json({ ok: true, message: "Thanks! Your message has been sent." });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ ok: false, message: "Failed to send message. Please try again later." });
  }
});

// Fallback to index.html for any other route (optional for SPAs)
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Simple HTML escape to avoid reflected HTML
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));