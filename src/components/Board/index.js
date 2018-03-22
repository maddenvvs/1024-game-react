// @flow
import * as React from "react";
import CellGrid from "../CellGrid";
import TileGrid from "../TileGrid";
import * as Actions from "../../constants/user_actions";

import type Grid from "../../board/grid";
import type { UserAction } from "../../constants/user_actions";

/* eslint-disable no-useless-computed-key */
const KeyMap: { [key: number]: UserAction } = {
  [38]: Actions.USER_ACTION_UP, // Up
  [39]: Actions.USER_ACTION_RIGHT, // Right
  [40]: Actions.USER_ACTION_DOWN, // Down
  [37]: Actions.USER_ACTION_LEFT, // Left
  [87]: Actions.USER_ACTION_UP, // W
  [68]: Actions.USER_ACTION_RIGHT, // D
  [83]: Actions.USER_ACTION_DOWN, // S
  [65]: Actions.USER_ACTION_LEFT, // A

  [82]: Actions.USER_ACTION_RESTART // R
};
/* eslint-enable no-useless-computed-key */

type BoardProps = {
  keepPlaying: boolean,
  board: Grid,
  onPlayerAction: UserAction => void
};

class Board extends React.Component<BoardProps> {
  touchStartClientX: number;
  touchStartClientY: number;

  handleKeyDown: KeyboardEventListener = event => {
    var modifiers =
      event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    var mapped = KeyMap[event.which];

    if (!modifiers && mapped !== undefined) {
      event.preventDefault();
      this.props.onPlayerAction(mapped);
    }
  };

  handleTouchStart: TouchEventHandler = event => {
    if (event.touches.length > 1) return;

    this.touchStartClientX = event.touches[0].clientX;
    this.touchStartClientY = event.touches[0].clientY;

    event.preventDefault();
  };

  handleTouchMove: TouchEventHandler = event => {
    event.preventDefault();
  };

  handleTouchEnd: TouchEventHandler = event => {
    if (event.touches.length > 0) return;

    var touchEndClientX, touchEndClientY;

    touchEndClientX = event.changedTouches[0].clientX;
    touchEndClientY = event.changedTouches[0].clientY;

    var dx = touchEndClientX - this.touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = touchEndClientY - this.touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      this.props.onPlayerAction(
        absDx > absDy
          ? dx > 0 ? Actions.USER_ACTION_RIGHT : Actions.USER_ACTION_LEFT
          : dy > 0 ? Actions.USER_ACTION_DOWN : Actions.USER_ACTION_UP
      );
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  shouldComponentUpdate(nextProps: BoardProps) {
    if (!this.props.keepPlaying && nextProps.keepPlaying) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    const { board } = this.props;

    return (
      <div
        className="board"
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        <TileGrid board={board} />
        <CellGrid />
      </div>
    );
  }
}

export default Board;
