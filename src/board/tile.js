// @flow
export type Position = {
  x: number,
  y: number
};

export type SerializedTile = {
  x: number,
  y: number,
  value: number
};

export default class Tile {
  x: number;
  y: number;
  value: number;
  prevPosition: ?Position;
  mergedFrom: ?Array<Tile>;

  constructor({ x, y }: Position, value: number = 2) {
    this.x = x;
    this.y = y;
    this.value = value;

    this.prevPosition = null;
    this.mergedFrom = null;
  }

  savePosition() {
    this.prevPosition = { x: this.x, y: this.y };
  }

  updatePosition({ x, y }: Position) {
    this.x = x;
    this.y = y;
  }

  toObject(): SerializedTile {
    const { x, y, value } = this;
    return {
      x,
      y,
      value
    };
  }
}
