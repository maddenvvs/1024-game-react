// @flow
import * as React from "react";
import BoardTile from "./BoardTile";

import type Grid from "../../board/grid";

import "./TileGrid.css";

function nextId() {
  return nextId.value++;
}
nextId.value = 0;

function renderTiles(board) {
  const tiles = [];

  board.tiles().forEach(tile => {
    const { mergedFrom } = tile;
    if (mergedFrom) {
      mergedFrom.forEach(tile => {
        tiles.push(<BoardTile key={nextId()} tile={tile} />);
      });
    }
    tiles.push(<BoardTile key={nextId()} tile={tile} />);
  });

  return tiles;
}

function TileGrid(props: { board: Grid }) {
  const { board } = props;
  const tiles = renderTiles(board);

  return <div className="tiles">{tiles}</div>;
}

export default TileGrid;
