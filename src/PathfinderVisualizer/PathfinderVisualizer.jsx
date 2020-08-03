import React from "react";
import Board from "../Board/Board";
import { computeDijkstra, extractShortestPath } from "../Algorithms/Dijkstra";

import "./PathfinderVisualizer.css";

const SQUARE_SIZE = 25;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const N_ROWS = Math.floor((screenHeight - 200) / SQUARE_SIZE);
const N_COLS = Math.floor(screenWidth / SQUARE_SIZE);
const START_NODE_ROW = Math.floor(N_ROWS / 2);
const START_NODE_COL = 5;
const FINISH_NODE_ROW = START_NODE_ROW;
const FINISH_NODE_COL = N_COLS - 6;

export default class PathfinderVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsClicked: false,
    };
  }

  componentDidMount() {
    const grid = initializeGrid(N_ROWS, N_COLS);
    this.setState({ grid: grid });
  }

  handleMouseDown(e, rowIndex, colIndex) {
    this.setState({ mouseIsClicked: true });

    if (e.shiftKey) {
      this.toggleWeight(rowIndex, colIndex);
    } else {
      this.toggleWall(rowIndex, colIndex);
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsClicked: false });
  }

  handleMouseEnter(e, rowIndex, colIndex) {
    if (!this.state.mouseIsClicked) return;

    if (e.shiftKey) {
      this.toggleWeight(rowIndex, colIndex);
    } else {
      this.toggleWall(rowIndex, colIndex);
    }
  }

  toggleWall(rowIndex, colIndex) {
    const grid = this.state.grid.slice();
    const node = grid[rowIndex][colIndex];

    if (node.isFinish || node.isStart) return;

    node.extraWeight = 0;
    node.isWall = !node.isWall;

    grid[rowIndex][colIndex] = node;
    this.setState({ grid: grid });
  }

  toggleWeight(rowIndex, colIndex) {
    const grid = this.state.grid.slice();
    const node = grid[rowIndex][colIndex];

    if (node.isFinish || node.isStart) return;

    node.isWall = false;
    node.extraWeight = (node.extraWeight + 3) % 12;

    grid[rowIndex][colIndex] = node;
    this.setState({ grid: grid });
  }

  visualizeDijkstra() {
    this.resetDistanceToNodes();
    const grid = this.state.grid;
    const visitedNodes = computeDijkstra(
      grid,
      grid[START_NODE_ROW][START_NODE_COL],
      grid[FINISH_NODE_ROW][FINISH_NODE_COL]
    );
    const shortestPath = extractShortestPath(
      grid[FINISH_NODE_ROW][FINISH_NODE_COL],
      grid
    );
    this.animateAlgorithm(visitedNodes, shortestPath);
  }

  animateAlgorithm(visitedNodes, shortestPath) {
    const grid = this.state.grid.slice();
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          this.updateNodesOnShortestPath(shortestPath, grid);
        }, 20 * i + 500);
        return;
      }

      setTimeout(() => {
        this.updateVisitedNode(visitedNodes[i], grid);
      }, 20 * i);
    }
  }

  updateVisitedNode(visitedNode, grid) {
    let rowIndex = visitedNode.rowIndex;
    let colIndex = visitedNode.colIndex;
    grid[rowIndex][colIndex].isVisited = true;

    this.setState({ grid: grid });
  }

  updateNodesOnShortestPath(shortestPath, grid) {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        let rowIndex = shortestPath[i].rowIndex;
        let colIndex = shortestPath[i].colIndex;
        grid[rowIndex][colIndex].isShortestPath = true;

        this.setState({ grid: grid });
      }, 50 * i);
    }
  }

  resetDistanceToNodes() {
    const grid = this.state.grid.slice();
    for (const row of grid) {
      for (const node of row) {
        node.isVisited = false;
        node.isShortestPath = false;
        node.routeDistance = Infinity;
        node.previousNodeIndex = [];
      }
    }
    this.setState({ grid: grid });
  }

  render() {
    return (
      <div className={"container"}>
        <div className={"menu"}>
          <a href="index.html">
            <img src="/images/logo.png" alt="Pathfinder logo"></img>
          </a>
          <br />

          <button
            className={"clickButton"}
            onClick={() => {
              this.setState({ grid: initializeGrid(N_ROWS, N_COLS) });
            }}
          >
            Clear board
          </button>

          <button
            className={"clickButton"}
            onClick={() => {
              this.visualizeDijkstra();
            }}
          >
            Dijkstra
          </button>
        </div>

        <Board
          grid={this.state.grid}
          onMouseEnter={(e, rowIndex, colIndex) =>
            this.handleMouseEnter(e, rowIndex, colIndex)
          }
          onMouseDown={(e, rowIndex, colIndex) =>
            this.handleMouseDown(e, rowIndex, colIndex)
          }
          onMouseUp={() => this.handleMouseUp()}
        />
        <div className={"info-container"}>
          <h3>Instructions</h3>
          <ul>
            <li>Click and hold to place walls.</li>
            <li>Shift-click a node to add extra weight.</li>
            <li>Choose algorithm.</li>
            <li>Watch it find the shortest path!</li>
          </ul>
        </div>
        <div className={"info-container"}>
          <h3>Symbols</h3>
          <ul className={"no-bullet"}>
            <li className={"green-square"}>Start node.</li>
            <li className={"red-square"}>Finish node.</li>
            <li className={"yellow-square"}>Shortest path.</li>
            <li className={"numbers-square"}>Added extra weight.</li>
          </ul>
        </div>
      </div>
    );
  }
}

function initializeGrid(rows, cols) {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];

    for (let j = 0; j < cols; j++) {
      const newNode = createNode(i, j);
      row.push(newNode);
    }
    grid.push(row);
  }
  return grid;
}

function createNode(rowIndex, colIndex) {
  return {
    rowIndex,
    colIndex,
    isStart: rowIndex === START_NODE_ROW && colIndex === START_NODE_COL,
    isFinish: rowIndex === FINISH_NODE_ROW && colIndex === FINISH_NODE_COL,
    isWall: false,
    isVisited: false,
    isShortestPath: false,
    routeDistance: Infinity,
    previousNodeIndex: [],
    extraWeight: 0,
  };
}
