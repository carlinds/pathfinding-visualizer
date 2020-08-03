import React from "react";

import "./Node.css";

export default class Node extends React.Component {
  render() {
    const classToRender = this.props.isStart
      ? "square square-start"
      : this.props.isFinish
      ? "square square-finish"
      : this.props.isWall
      ? "square square-wall"
      : this.props.isShortestPath
      ? "square square-shortest-path"
      : this.props.isVisited
      ? "square square-visited"
      : "square";

    const valueToRender =
      this.props.extraWeight > 0 ? this.props.extraWeight : "";
    return (
      <div
        className={classToRender}
        onMouseEnter={this.props.onMouseEnter}
        onMouseDown={this.props.onMouseDown}
      >
        <p>{valueToRender}</p>
      </div>
    );
  }
}
