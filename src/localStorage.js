// @flow
import type { SerializedGameState } from "./components/Game";

const fakeStorage: {
  _data: { [string]: string },
  getItem(key: string): ?string,
  setItem(key: string, data: string): void
} = {
  _data: {},

  setItem(id, val) {
    this._data[id] = val;
  },

  getItem(id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  }
};

function isLocalStorageSupported() {
  const key = "key";
  const storage = localStorage;

  try {
    storage.setItem(key, key);
    storage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

const storage = isLocalStorageSupported() ? localStorage : fakeStorage;
const gameStateKey = "gameState";

export function loadGame(): ?SerializedGameState {
  let state = storage.getItem(gameStateKey);
  return state ? JSON.parse(state) : null;
}

export function saveGame(gameState: SerializedGameState) {
  storage.setItem(gameStateKey, JSON.stringify(gameState));
}
