// @flow
import * as React from "react";
import { MAX_SCORE } from "../../constants/game_constants";

import type Tile from "../../board/tile";

class BoardTile extends React.Component<{ tile: Tile }> {
  skippedFrame: boolean;
  frameId: any;
  tileNode: any;

  storeRef = (node: ?HTMLElement) => {
    this.tileNode = node;
  };

  componentDidMount() {
    if (this.props.tile.prevPosition) {
      this.animateMovement();
    }
  }

  animateMovement() {
    this.skippedFrame = false;
    this.frameId = requestAnimationFrame(this.animate);
  }

  animate = () => {
    if (this.tileNode && this.frameId) {
      if (this.skippedFrame) {
        const { x, y } = this.props.tile;

        const classes = [...this.tileNode.classList];
        classes[2] = `tile__position-${x + 1}-${y + 1}`;

        this.tileNode.className = classes.join(" ");
      } else {
        this.skippedFrame = true;
        this.frameId = requestAnimationFrame(this.animate);
      }
    }
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
  }

  render() {
    const { x, y, value, prevPosition, mergedFrom } = this.props.tile;
    const position = prevPosition || { x, y };

    const tileClasses = [
      "tile",
      `tile__${value}`,
      `tile__position-${position.x + 1}-${position.y + 1}`
    ];

    if (mergedFrom) {
      tileClasses.push("tile__merged");
    } else if (!prevPosition) {
      tileClasses.push("tile__new");
    }

    if (value > MAX_SCORE) tileClasses.push("tile__super");

    return (
      <div ref={this.storeRef} className={tileClasses.join(" ")}>
        <div className="tile-inner">{value}</div>
      </div>
    );
  }
}

export default BoardTile;
