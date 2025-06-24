const express = require('express');
const { execFile } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend is live!');
});

app.get('/run', (req, res) => {
  execFile('./build/toolkit.exe', (err, stdout, stderr) => {
    if (err) return res.status(500).send(`Error: ${stderr}`);
    res.send(`Output:\n${stdout}`);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});