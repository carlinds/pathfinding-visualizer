export function computeDijkstra(grid, startNode, finishNode) {
  const unvisitedNodes = getSetFromGrid(grid);
  const visitedNodes = [];
  startNode.routeDistance = 0;

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    let closestNode = unvisitedNodes.shift();
    if (closestNode.routeDistance === Infinity) {
      return visitedNodes;
    }
    if (closestNode.isWall) continue;

    visitedNodes.push(closestNode);
    if (closestNode.isFinish) return visitedNodes;

    let closestNeighbours = getClosestNeighbours(closestNode, grid);
    for (const neighbourNode of closestNeighbours) {
      updateShortestRouteDistance(neighbourNode, closestNode);
    }
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort(
    (firstNode, secondNode) =>
      firstNode.routeDistance - secondNode.routeDistance
  );
}

function getSetFromGrid(grid) {
  const setOfNodes = [];
  for (const row of grid) {
    for (const node of row) {
      setOfNodes.push(node);
    }
  }
  return setOfNodes;
}

function getClosestNeighbours(node, grid) {
  let neighbours = [];
  let row = node.rowIndex;
  let col = node.colIndex;

  if (row > 0) neighbours.push(grid[row - 1][col]); // TOP
  if (col > 0) neighbours.push(grid[row][col - 1]); // LEFT
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]); // BOTTOM
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]); // RIGHT
  return neighbours;
}

function updateShortestRouteDistance(nodeToUpdate, currentNode) {
  let alternativeDistance =
    currentNode.routeDistance + 1 + nodeToUpdate.extraWeight;

  if (alternativeDistance < nodeToUpdate.routeDistance) {
    nodeToUpdate.routeDistance = alternativeDistance;
    nodeToUpdate.previousNodeIndex = [
      currentNode.rowIndex,
      currentNode.colIndex,
    ];
  }
}

export function extractShortestPath(finishNode, grid) {
  const shortestPath = [];

  if (!finishNode.previousNodeIndex.length) {
    return shortestPath;
  }

  let currentNode =
    grid[finishNode.previousNodeIndex[0]][finishNode.previousNodeIndex[1]];

  while (!currentNode.isStart) {
    shortestPath.unshift(currentNode);
    currentNode =
      grid[currentNode.previousNodeIndex[0]][currentNode.previousNodeIndex[1]];
  }
  return shortestPath;
}
