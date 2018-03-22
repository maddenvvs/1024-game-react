// @flow
import * as React from "react";
import { BOARD_SIZE } from "../../constants/game_constants";

import "./CellGrid.css";

function CellGrid() {
  const rows = Array.from(Array(BOARD_SIZE).keys()).map(index => {
    const cells = Array.from(Array(BOARD_SIZE).keys()).map(index => (
      <div key={index} className="cell" />
    ));
    return (
      <div key={index} className="cell-row">
        {cells}
      </div>
    );
  });

  return <div className="cell-grid">{rows}</div>;
}

export default CellGrid;
