import 'aframe';
import 'aframe-extras';
import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import GraphVisualizer from "./components/GraphVisualizer";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [adjList, setAdjList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDirected, setIsDirected] = useState(false);
  const [isWeighted, setIsWeighted] = useState(false);

  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [shortestPathResult, setShortestPathResult] = useState("TBD");

  const sanitizeInput = (rawInput) => rawInput.replace(/\\n/g, "\n").trim();

  const getGraphSize = (text) => {
    const lines = text.trim().split("\n");
    if (lines.length === 0) return [0, 0];
    const [n, m] = lines[0].split(/\s+/).map(Number);
    return [n || 0, m || 0];
  };

  const handleRun = async () => {
    if (!input.trim()) return;
    const cleanInput = sanitizeInput(input);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/run", {
        input: cleanInput,
        isDirected,
        isWeighted,
      });
      setOutput(res.data.output);

      const lines = res.data.output
        .split("\n")
        .filter((l) => l.includes(":"));

      if (!isWeighted) {
        const parsed = lines.map((line) =>
          line
            .split(":")[1]
            .trim()
            .split(/\s+/)
            .map(Number)
            .filter((n) => !isNaN(n))
        );
        setAdjList(parsed);
      } else {
        const weightedParsed = lines.map((line) => {
          const parts = line
            .split(":")[1]
            .trim()
            .split(/\s+/)
            .map(Number);

          const node = [];
          for (let i = 0; i + 1 < parts.length; i += 2) {
            node.push({ to: parts[i], weight: parts[i + 1] });
          }
          return node;
        });
        setAdjList(weightedParsed);
      }
    } catch (err) {
      setOutput("Error: " + (err.response?.data?.error || err.message));
      setAdjList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShortestPath = async () => {
    const cleanInput = sanitizeInput(input);
    try {
      const res = await axios.post("http://localhost:5000/shortest-path", {
        input: cleanInput,
        isDirected,
        isWeighted,
        source: Number(source),
        target: Number(target),
      });
      setShortestPathResult(res.data.result);
    } catch (err) {
      setShortestPathResult("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="app">
      <h1>⚙️ Competitive Programming Toolkit</h1>

      <div className="checkboxes">
        <label>
          <input
            type="checkbox"
            checked={isDirected}
            onChange={() => setIsDirected(!isDirected)}
          />
          Directed Graph
        </label>
        <label>
          <input
            type="checkbox"
            checked={isWeighted}
            onChange={() => setIsWeighted(!isWeighted)}
          />
          Weighted Graph
        </label>
      </div>

      <textarea
        className="input-box"
        rows={10}
        placeholder={
          isWeighted
            ? "Example:\n4 3\n0 1 5\n1 2 2\n2 3 7"
            : "Example:\n4 3\n0 1\n1 2\n2 3"
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleRun} disabled={loading}>
        {loading ? "Running..." : "Run Algorithm"}
      </button>

      <div className="output-box">
        <h2>🧾 Output</h2>
        <pre>{output}</pre>
      </div>

      <div className="graph-box">
        <h2>📊 Graph Visualization</h2>
        <GraphVisualizer adjList={adjList} isDirected={isDirected} isWeighted={isWeighted} />
      </div>

      <div className="shortest-path-panel">
        <h2>🛣️ Query Shortest Path</h2>
        <div className="shortest-path-inputs">
          <input
            type="number"
            placeholder="Source node"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <input
            type="number"
            placeholder="Target node"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <button onClick={handleShortestPath} disabled={!source || !target}>
            Find Shortest Path
          </button>
        </div>
        <p className="path-result">Result: {shortestPathResult}</p>
      </div>

      <div className="info-panel">
        <h2>📚 Graph Analysis</h2>
        <ul>
          <li>✅ Cycle Detected: TBD</li>
          <li>🔗 Bridges: TBD</li>
          <li>🌉 Articulation Points: TBD</li>
          <li>📐 MST Weight: TBD</li>
          <li>🧭 Toposort: TBD</li>
          <li>🛣️ Shortest Path (0→3): {shortestPathResult}</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
