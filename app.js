const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// const filePath = path.join(__dirname, 'storage', 'db-file.txt');
// Change the code to test rollout
const filePath = path.join(__dirname, process.env.FOLDER, 'db-file.txt');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Kubernetes Demo!</h1>
    <p>This is a static page</p>
  `);
});

app.get('/users', (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to open file.' });
    }
    res.status(200).json({ storage: data.toString() });
  });
});

app.post('/users', (req, res) => {
  const newText = JSON.stringify(req.body);
  if (newText.length === 0) {
    return res.status(422).json({ message: 'Text must not be empty!' });
  }
  
  fs.appendFile(filePath, newText + "\n", (err) => {
    if (err) {
      return res.status(500).json({ message: 'Storing the text failed.' });
    }
    res.status(201).json({ message: 'Text was stored!' });
  });
});

app.get('/error', (req, res) => {
  process.exit(1);
});

app.listen(8080);
