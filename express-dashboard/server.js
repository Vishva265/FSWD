// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON (optional for future use)
app.use(express.json());

// Basic /home route
app.get('/home', (req, res) => {
  res.send('<h1>Welcome to the Dashboard!</h1><p></p>');
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('Server is running. Visit /home to see the dashboard.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
