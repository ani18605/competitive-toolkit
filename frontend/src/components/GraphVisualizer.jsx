import React, { useRef, useEffect } from "react";
import { ForceGraph2D } from "react-force-graph";

/**
 * GraphVisualizer renders a force-directed graph using react-force-graph.
 * Props:
 *   - adjList: Array of neighbor lists (number or { to, weight }).
 *   - directed: boolean, whether edges are directed.
 *   - weighted: boolean, whether edges carry weights.
 */
export default function GraphVisualizer({ adjList, directed = false, weighted = false }) {
  const fgRef = useRef();

  // Always run effect hooks in the same order
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    // Physics tuning
    fg.d3Force("charge").strength(-120);
    fg.d3Force("link").distance(link => 30 + (link.weight || 1) * 5);
  }, [adjList]);

  // Early return for empty data
  if (!adjList || adjList.length === 0) {
    return (
      <div className="p-6 rounded-lg shadow-md bg-gray-100 text-gray-500 text-center">
        No graph to display
      </div>
    );
  }

  // Build node objects
  const nodes = adjList.map((_, i) => ({ id: i, name: `Node ${i}` }));

  // Build links with curvature & optional reverse edges
  const links = [];
  adjList.forEach((neighbors, u) => {
    neighbors.forEach((entry, idx) => {
      const v = typeof entry === 'number' ? entry : entry.to;
      const w = typeof entry === 'object' ? entry.weight : 1;
      links.push({ source: u, target: v, weight: w, curv: (idx + 1) * 0.2 });
      if (!directed) {
        links.push({ source: v, target: u, weight: w, curv: (idx + 1) * -0.2 });
      }
    });
  });

  // Auto-zoom when layout finishes
  const handleEngineStop = () => {
    fgRef.current.zoomToFit(500, 40);
  };

  return (
    <div className="h-[600px] rounded-lg shadow-xl bg-gradient-to-br from-gray-900 to-black p-4">
      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes, links }}
        nodeLabel="name"
        linkLabel={link => `w: ${link.weight}`}
        nodeAutoColorBy="id"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px sans-serif`;
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.fillText(label, node.x + 10, node.y + 4);
        }}
        linkCurvature="curv"
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkWidth={link => 1 + link.weight * 0.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={link => link.weight * 1.2}
        cooldownTicks={200}
        onEngineStop={handleEngineStop}
        enableNodeDrag
        backgroundColor="#111"
      />
    </div>
  );
}
