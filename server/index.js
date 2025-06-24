
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const runCpp = (input, callback) => {
  const process = exec("./program", { cwd: "../backend" }, (err, stdout, stderr) => {
    if (err) return callback(err.message);
    if (stderr) return callback(stderr);
    return callback(null, stdout);
  });

  process.stdin.write(input);
  process.stdin.end();
};

app.post("/run", (req, res) => {
  const { input, isDirected, isWeighted } = req.body;

  const lines = input.trim().split("\n");
  if (lines.length < 1) return res.status(400).json({ error: "Invalid input" });

  const [n, m] = lines[0].trim().split(/\s+/).map(Number);
  const graphData = lines.slice(1).join("\n");

  const fullInput = `${n} ${m} ${isDirected ? 1 : 0} ${isWeighted ? 1 : 0}\n${graphData}\n`;

  runCpp(fullInput, (err, output) => {
    if (err) return res.status(500).json({ error: err });
    return res.json({ output });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
