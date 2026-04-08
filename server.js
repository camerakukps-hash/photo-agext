const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Init data file
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// REST API for Links
app.get('/api/links', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/links', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const newLink = {
      id: Date.now().toString(),
      name: req.body.name,
      url: req.body.url,
      dateAdded: new Date().toISOString()
    };
    data.push(newLink);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
    res.json({ success: true, link: newLink });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.delete('/api/links/:id', (req, res) => {
  try {
    let data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data = data.filter(item => item.id !== req.params.id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

// Serve frontend apps
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin_client')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
