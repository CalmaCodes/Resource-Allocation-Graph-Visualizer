export function detectDeadlock(nodes, edges) {
  const graph = {};

  nodes.forEach((node) => {
    graph[node.id] = [];
  });

  edges.forEach((edge) => {
    graph[edge.from].push(edge.to);
  });

  const visited = {};
  const stack = {};
  const path = [];

  let cycle = [];

  function dfs(nodeId) {
    visited[nodeId] = true;
    stack[nodeId] = true;
    path.push(nodeId);

    for (const next of graph[nodeId]) {
      if (!visited[next]) {
        if (dfs(next)) return true;
      } else if (stack[next]) {
        const start =
          path.indexOf(next);

        cycle = path.slice(start);
        return true;
      }
    }

    stack[nodeId] = false;
    path.pop();
    return false;
  }

  for (const node of nodes) {
    if (!visited[node.id]) {
      if (dfs(node.id)) break;
    }
  }

  return {
    deadlock: cycle.length > 0,
    cycle,
  };
}