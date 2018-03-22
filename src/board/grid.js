// @flow
import Tile from "./tile";
import type { Position, SerializedTile } from "./tile";

type Direction = 0 | 1 | 2 | 3;

/* eslint-disable no-useless-computed-key */
const DirectionToVector: { [Direction]: Position } = {
  [0]: { x: 0, y: -1 }, // Up
  [1]: { x: 1, y: 0 }, // Right
  [2]: { x: 0, y: 1 }, // Down
  [3]: { x: -1, y: 0 } // Left
};
/* eslint-enable no-useless-computed-key */

type Cell = ?Tile;
type CellGrid = Array<Array<Cell>>;
export type SerializedGrid = Array<Array<?SerializedTile>>;

export default class Grid {
  size: number;
  cells: CellGrid;

  constructor(size: number, previousState?: SerializedGrid) {
    this.size = size;
    this.cells = previousState ? this.fromObject(previousState) : this.empty();
  }

  empty(): CellGrid {
    const cells = [];

    for (let x = 0; x < this.size; x++) {
      cells.push([]);
      const row = cells[x];

      for (let y = 0; y < this.size; y++) {
        row.push(null);
      }
    }

    return cells;
  }

  fromObject(state: SerializedGrid): CellGrid {
    const cells = [];

    for (let x = 0; x < this.size; x++) {
      cells.push([]);
      const row = cells[x];

      for (let y = 0; y < this.size; y++) {
        const tile = state[x][y];
        row.push(tile ? new Tile({ x: tile.x, y: tile.y }, tile.value) : null);
      }
    }

    return cells;
  }

  toObject(): SerializedGrid {
    const cells = [];

    for (let x = 0; x < this.size; x++) {
      const row = (cells[x] = []);

      for (let y = 0; y < this.size; y++) {
        row.push(this.cells[x][y] ? this.cells[x][y].toObject() : null);
      }
    }

    return cells;
  }

  addRandomTile() {
    if (this.anyCellsAvailable()) {
      const value = Math.random() < 0.9 ? 2 : 4;
      const cell = this.randomAvailableCell();
      if (cell) {
        this.insertTile(new Tile(cell, value));
      }
    }
  }

  randomAvailableCell() {
    let cells = this.availableCells();

    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  }

  availableCells(): Array<Position> {
    let cells = [];

    for (let { x, y, cell } of this.allCells()) {
      if (!cell) {
        cells.push({ x, y });
      }
    }

    return cells;
  }

  tiles(): Array<Tile> {
    let cells = [];

    for (let { cell } of this.allCells()) {
      if (cell) {
        cells.push(cell);
      }
    }

    return cells;
  }

  *allCells(): Generator<{ x: number, y: number, cell: Cell }, void, void> {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        yield { x, y, cell: this.cells[x][y] };
      }
    }
  }

  anyCellsAvailable() {
    return !!this.availableCells().length;
  }

  isCellAvailable(cell: Position) {
    return !this.isCellOccupied(cell);
  }

  isCellOccupied(cell: Position) {
    return !!this.cellContent(cell);
  }

  cellContent(cell: Position) {
    const { x, y } = cell;
    return this.inGrid(cell) ? this.cells[x][y] : null;
  }

  insertTile(tile: Tile) {
    this.cells[tile.x][tile.y] = tile;
  }

  removeTile(tile: Tile) {
    this.cells[tile.x][tile.y] = null;
  }

  inGrid({ x, y }: Position) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  prepareTiles() {
    this.tiles().forEach(tile => {
      tile.mergedFrom = null;
      tile.savePosition();
    });
  }

  moveTile(tile: Tile, cell: Position) {
    this.cells[tile.x][tile.y] = null;
    this.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
  }

  positionsEqual(first: Position, second: Position) {
    return first.x === second.x && first.y === second.y;
  }

  anyTileMatchesAvailable() {
    let tilesAvailable = false;

    this.tiles().forEach(tile => {
      const { x, y, value } = tile;
      for (let direction: any = 0; direction < 4; direction++) {
        const vector = DirectionToVector[direction];
        const cell = { x: x + vector.x, y: y + vector.y };

        const other = this.cellContent(cell);

        // TODO: how to make early exit?
        if (other && other.value === value) {
          tilesAvailable = true;
        }
      }
    });

    return tilesAvailable;
  }

  anyMovesAvailable() {
    return this.anyCellsAvailable() || this.anyTileMatchesAvailable();
  }

  *traverseCells(vector: Position): Generator<Position, void, void> {
    let xOrder = [],
      yOrder = [];

    for (let pos = 0; pos < this.size; pos++) {
      xOrder.push(pos);
      yOrder.push(pos);
    }

    if (vector.x === 1) xOrder.reverse();
    if (vector.y === 1) yOrder.reverse();

    for (let x of xOrder) {
      for (let y of yOrder) {
        yield { x, y };
      }
    }
  }

  *traverseTiles(
    vector: Position
  ): Generator<{ cell: Position, tile: Tile }, void, void> {
    for (let cell of this.traverseCells(vector)) {
      const tile = this.cellContent(cell);
      if (tile) yield { cell, tile };
    }
  }

  findPositionToMove(cell: Position, vector: Position) {
    let prevCell;

    do {
      prevCell = cell;
      cell = { x: prevCell.x + vector.x, y: prevCell.y + vector.y };
    } while (this.inGrid(cell) && this.isCellAvailable(cell));

    return {
      farthest: prevCell,
      next: cell
    };
  }

  move(direction: Direction) {
    const vector = DirectionToVector[direction];
    let moved = false,
      score = 0,
      maxValue = Math.max(...this.tiles().map(t => t.value));

    this.prepareTiles();

    for (let { cell, tile } of this.traverseTiles(vector)) {
      const positions = this.findPositionToMove(cell, vector);
      const nextTile = this.cellContent(positions.next);

      if (nextTile && nextTile.value === tile.value && !nextTile.mergedFrom) {
        const merged = new Tile(positions.next, tile.value * 2);
        merged.mergedFrom = [tile, nextTile];

        this.insertTile(merged);
        this.removeTile(tile);

        tile.updatePosition(positions.next);

        score += merged.value;
        maxValue = Math.max(maxValue, merged.value);
      } else {
        this.moveTile(tile, positions.farthest);
      }

      if (!this.positionsEqual(cell, tile)) {
        moved = true;
      }
    }

    return {
      moved,
      score,
      maxValue
    };
  }
}
