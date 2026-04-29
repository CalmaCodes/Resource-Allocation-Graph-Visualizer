import { useState } from "react";
import LeftPanel from "./components/LeftPanel";
import GraphCanvas from "./components/GraphCanvas";
import RightPanel from "./components/RightPanel";
import { detectDeadlock } from "./utils/deadlock";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [logs, setLogs] = useState([
    "System initialized",
  ]);

  const analysis = detectDeadlock(
  nodes,
  edges
);

  const [selectedProcess, setSelectedProcess] =
    useState("");

  const [selectedResource, setSelectedResource] =
    useState("");

  function addLog(text) {
    setLogs((prev) => [text, ...prev].slice(0, 20));
  }

  function addProcess() {
    const count =
      nodes.filter(
        (node) => node.type === "process"
      ).length + 1;

    const newNode = {
      id: `P${count}`,
      type: "process",
      x: 220 + Math.random() * 350,
      y: 100 + Math.random() * 320,
    };

    setNodes((prev) => [...prev, newNode]);

    addLog(`${newNode.id} created`);
  }

  function addResource() {
    const count =
      nodes.filter(
        (node) => node.type === "resource"
      ).length + 1;

    const newNode = {
      id: `R${count}`,
      type: "resource",
      x: 320 + Math.random() * 350,
      y: 100 + Math.random() * 320,
    };

    setNodes((prev) => [...prev, newNode]);

    addLog(`${newNode.id} created`);
  }

  function addRequest() {
    if (
      !selectedProcess ||
      !selectedResource
    )
      return;

    setEdges((prev) => [
      ...prev,
      {
        from: selectedProcess,
        to: selectedResource,
        type: "request",
      },
    ]);

    addLog(
      `${selectedProcess} requests ${selectedResource}`
    );
  }

  function addAllocation() {
    if (
      !selectedProcess ||
      !selectedResource
    )
      return;

    setEdges((prev) => [
      ...prev,
      {
        from: selectedResource,
        to: selectedProcess,
        type: "allocation",
      },
    ]);

    addLog(
      `${selectedResource} allocated to ${selectedProcess}`
    );
  }

  function resetSystem() {
  setNodes([]);
  setEdges([]);
  setLogs(["System reset"]);
  setSelectedProcess("");
  setSelectedResource("");
}

function loadDeadlockPreset() {
  const presetNodes = [
    { id: "P1", type: "process", x: 180, y: 140 },
    { id: "P2", type: "process", x: 520, y: 340 },
    { id: "R1", type: "resource", x: 500, y: 140 },
    { id: "R2", type: "resource", x: 220, y: 340 },
  ];

  const presetEdges = [
    { from: "R1", to: "P1", type: "allocation" },
    { from: "P1", to: "R2", type: "request" },
    { from: "R2", to: "P2", type: "allocation" },
    { from: "P2", to: "R1", type: "request" },
  ];

  setNodes(presetNodes);
  setEdges(presetEdges);
  setLogs([
    "Deadlock scenario loaded",
  ]);
}

function loadSafePreset() {
  const presetNodes = [
    { id: "P1", type: "process", x: 220, y: 220 },
    { id: "R1", type: "resource", x: 500, y: 220 },
  ];

  const presetEdges = [
    { from: "R1", to: "P1", type: "allocation" },
  ];

  setNodes(presetNodes);
  setEdges(presetEdges);
  setLogs([
    "Safe scenario loaded",
  ]);
}

  const selectedNode =
    nodes.find(
      (node) =>
        node.id === selectedProcess ||
        node.id === selectedResource
    ) || null;

  return (
    <div className="h-screen flex bg-zinc-950 text-white">

      <div className="w-[300px] border-r border-zinc-800">
        <LeftPanel
          nodes={nodes}
          total={nodes.length}

          selectedProcess={selectedProcess}
          setSelectedProcess={setSelectedProcess}

          selectedResource={selectedResource}
          setSelectedResource={setSelectedResource}

          addProcess={addProcess}
          addResource={addResource}
          addRequest={addRequest}
          addAllocation={addAllocation}

          loadDeadlockPreset={loadDeadlockPreset}
          loadSafePreset={loadSafePreset}
          resetSystem={resetSystem}
          
        />
      </div>

      <div className="flex-1">
        <GraphCanvas
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          cycle={analysis.cycle}
        />
      </div>

      <div className="w-[320px] border-l border-zinc-800">
        <RightPanel
          nodes={nodes}
          edges={edges}
          deadlock={analysis.deadlock}
          logs={logs}
          cycle={analysis.cycle}
          resetSystem={resetSystem}
        />
      </div>

    </div>
  );
}