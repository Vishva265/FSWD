const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// GET: Display form
app.get("/", (req, res) => {
  res.render("form", { error: null });
});

// POST: Process form data
app.post("/calculate", (req, res) => {
  const { income1, income2 } = req.body;

  // Validation
  if (!income1 || !income2 || isNaN(income1) || isNaN(income2)) {
    return res.render("form", { error: "Please enter valid numbers for both incomes." });
  }

  const totalIncome = parseFloat(income1) + parseFloat(income2);

  res.render("result", { income1, income2, totalIncome });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
