const express = require('express');
const { exec, execFile } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend is live!');
});

app.get('/run', (req, res) => {
  exec('g++ runner.cpp -o toolkit', (compileErr) => {
    if (compileErr) return res.status(500).send(`Compile Error: ${compileErr}`);

    execFile('./toolkit', (err, stdout, stderr) => {
      if (err) return res.status(500).send(`Execution Error: ${stderr}`);
      res.send(`Output:\n${stdout}`);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
