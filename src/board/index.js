// @flow
import Grid from "./grid";
import type { SerializedGrid } from "./grid";

export default function createBoard(
  size: number,
  prevState?: SerializedGrid
): Grid {
  return new Grid(size, prevState);
}
