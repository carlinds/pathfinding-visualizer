import React from "react";
import Node from "../Node/Node";

import "./Board.css";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight - 200;

export default class Board extends React.Component {
  componentDidMount() {
    setBoardWidth(screenWidth);
    setBoardHeight(screenHeight);
  }

  renderSquare(rowIndex, colIndex) {
    return (
      <Node
        isWall={this.props.grid[rowIndex][colIndex].isWall}
        isStart={this.props.grid[rowIndex][colIndex].isStart}
        isFinish={this.props.grid[rowIndex][colIndex].isFinish}
        isVisited={this.props.grid[rowIndex][colIndex].isVisited}
        isShortestPath={this.props.grid[rowIndex][colIndex].isShortestPath}
        extraWeight={this.props.grid[rowIndex][colIndex].extraWeight}
        onMouseEnter={(e) => this.props.onMouseEnter(e, rowIndex, colIndex)}
        onMouseDown={(e) => this.props.onMouseDown(e, rowIndex, colIndex)}
        key={colIndex}
      />
    );
  }

  renderGrid(grid) {
    return (
      <div id="board" onMouseUp={this.props.onMouseUp}>
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex}>
              {row.map((node, colIndex) => {
                return this.renderSquare(rowIndex, colIndex);
              })}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const grid = this.props.grid;

    return this.renderGrid(grid);
  }
}

function setBoardWidth(screenWidth) {
  document.getElementById("board").style.width = screenWidth + "px";
}

function setBoardHeight(screenHeight) {
  document.getElementById("board").style.height = screenHeight + "px";
}
