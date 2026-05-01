import { useState } from "react";

export default function GraphCanvas({
  nodes,
  setNodes,
  edges,
  cycle = [],
}) {
  const [dragging, setDragging] =
    useState(null);

  function getNode(id) {
    return nodes.find(
      (node) => node.id === id
    );
  }

  function inCycle(from, to) {
    for (let i = 0; i < cycle.length; i++) {
      const current = cycle[i];
      const next =
        cycle[(i + 1) % cycle.length];

      if (
        current === from &&
        next === to
      ) {
        return true;
      }
    }

    return false;
  }

  function handleDown(e, node) {
    const rect =
      e.currentTarget.getBoundingClientRect();

    setDragging({
      id: node.id,
      offsetX:
        e.clientX - rect.left,
      offsetY:
        e.clientY - rect.top,
    });
  }

  function handleMove(e) {
    if (!dragging) return;

    const rect =
      e.currentTarget.getBoundingClientRect();

    const x =
      e.clientX -
      rect.left -
      dragging.offsetX;

    const y =
      e.clientY -
      rect.top -
      dragging.offsetY;

    setNodes((prev) =>
      prev.map((node) =>
        node.id === dragging.id
          ? { ...node, x, y }
          : node
      )
    );
  }

  return (
    <div
      className="h-full relative overflow-hidden"
      onMouseMove={handleMove}
      onMouseUp={() =>
        setDragging(null)
      }
      onMouseLeave={() =>
        setDragging(null)
      }
    >

      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

      <svg className="absolute inset-0 w-full h-full">

        <defs>

          <marker
            id="arrowWhite"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L9,3 z"
              fill="white"
            />
          </marker>

          <marker
            id="arrowRed"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L9,3 z"
              fill="#ef4444"
            />
          </marker>

        </defs>

        {edges.map((edge, i) => {
          const from = getNode(edge.from);
          const to = getNode(edge.to);

          if (!from || !to) return null;

          const culprit =
            inCycle(
              edge.from,
              edge.to
            );

          const startX = from.x + 32;
          const startY = from.y + 32;

          const targetX = to.x + 32;
          const targetY = to.y + 32;

          const dx =
            targetX - startX;

          const dy =
            targetY - startY;

          const dist =
            Math.sqrt(
              dx * dx + dy * dy
            ) || 1;

          const offset = 38;

          const endX =
            targetX -
            (dx / dist) *
              offset;

          const endY =
            targetY -
            (dy / dist) *
              offset;

          return (
            <line
              key={i}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={
                culprit
                  ? "#ef4444"
                  : "white"
              }
              strokeWidth={
                culprit ? 4 : 2
              }
              strokeDasharray={
                edge.type ===
                "request"
                  ? "8 8"
                  : "0"
              }
              markerEnd={
                culprit
                  ? "url(#arrowRed)"
                  : "url(#arrowWhite)"
              }
              className={
                culprit
                  ? "animate-pulse"
                  : ""
              }
              opacity={
                cycle.length > 0 &&
                !culprit
                  ? 0.35
                  : 1
              }
            />
          );
        })}

      </svg>

      {nodes.map((node) => (
        <div
          key={node.id}
          onMouseDown={(e) =>
            handleDown(e, node)
          }
          className={`absolute cursor-grab flex items-center justify-center select-none transition-all duration-300 shadow-xl ${
            node.type === "process"
              ? "w-16 h-16 rounded-full"
              : "w-16 h-16 rounded-2xl"
          } ${
            cycle.length > 0
              ? cycle.includes(
                  node.id
                )
                ? "bg-red-950 border border-red-500 text-red-200 scale-105 shadow-[0_0_28px_rgba(239,68,68,0.55)] animate-pulse z-10"
                : "bg-zinc-800 border border-zinc-700 text-zinc-400 opacity-45"
              : "bg-zinc-800 border border-zinc-600 text-white hover:border-white"
          }`}
          style={{
            left: node.x,
            top: node.y,
          }}
        >
          {node.id}
        </div>
      ))}
    </div>
  );
}