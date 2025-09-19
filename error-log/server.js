// Import express and fs
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Log file name
const logFile = "error.log";

// Route to show logs
app.get("/logs", (req, res) => {
  fs.readFile(logFile, "utf8", (err, data) => {
    if (err) {
      res.send("<h2>Could not read log file</h2>");
    } else {
      res.send(`<h1>Error Logs</h1><pre>${data}</pre>`);
    }
  });
});

// Home route
app.get("/", (req, res) => {
  res.send("<h2>Welcome</h2><p>Go to <a href='/logs'>/logs</a> to see logs</p>");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
