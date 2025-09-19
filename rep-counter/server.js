const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const COUNTER_FILE = path.join(__dirname, 'counter.json');

// Read current count
function getCount() {
  const data = fs.readFileSync(COUNTER_FILE, 'utf8');
  return JSON.parse(data).count;
}

// Write new count
function setCount(newCount) {
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: newCount }), 'utf8');
}

// API to get count
app.get('/api/count', (req, res) => {
  res.json({ count: getCount() });
});

// API to update count (+ or -)
app.post('/api/update', (req, res) => {
  let { delta } = req.body;
  let count = getCount();
  count = Math.max(0, count + delta); // avoid negative count
  setCount(count);
  res.json({ count });
});

// API to reset count
app.post('/api/reset', (req, res) => {
  setCount(0);
  res.json({ count: 0 });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
