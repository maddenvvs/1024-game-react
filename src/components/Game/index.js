// @flow
import * as React from "react";
import Header from "../Header";
import GameMessage from "../GameMessage";
import Board from "../Board";
import * as Actions from "../../constants/user_actions";
import createBoard from "../../board";
import { loadGame, saveGame } from "../../localStorage";
import {
  MAX_SCORE,
  BOARD_SIZE,
  INIT_TILES_COUNT
} from "../../constants/game_constants";

import type Grid, { SerializedGrid } from "../../board/grid";
import type { UserAction } from "../../constants/user_actions";

import "./Game.css";

const DefaultGameState = {
  score: 0,
  bestScore: 0,
  over: false,
  won: false,
  keepPlaying: false
};

type GameState = {
  score: number,
  bestScore: number,
  over: boolean,
  won: boolean,
  keepPlaying: boolean,
  board: Grid
};

export type SerializedGameState = {
  score: number,
  bestScore: number,
  over: boolean,
  won: boolean,
  keepPlaying: boolean,
  board: SerializedGrid
};

class Game extends React.Component<{}, GameState> {
  state = this.initialState();

  initialState(): GameState {
    let loadedState = loadGame();

    if (loadedState == null) {
      return {
        ...DefaultGameState,
        board: this.newBoard()
      };
    } else {
      return ({
        ...DefaultGameState,
        ...loadedState,
        board: createBoard(BOARD_SIZE, loadedState.board)
      }: any);
    }
  }

  newBoard() {
    let board = createBoard(BOARD_SIZE);

    for (var i = 0; i < INIT_TILES_COUNT; i++) {
      board.addRandomTile();
    }

    return board;
  }

  isGameTerminated() {
    const { over, won, keepPlaying } = this.state;
    return over || (won && !keepPlaying);
  }

  handleMoveMade = (move: any) => {
    if (this.isGameTerminated()) return;

    const { board } = this.state;
    const { moved, score, maxValue } = board.move(move);

    if (moved) {
      board.addRandomTile();

      this.setState(state => {
        const newScore = state.score + score;
        const bestScore = Math.max(state.bestScore, newScore);
        const won = !state.keepPlaying && maxValue >= MAX_SCORE;
        const over = !board.anyMovesAvailable();

        return {
          score: newScore,
          bestScore,
          won,
          over
        };
      });
    }
  };

  handleGameRestart = () => {
    this.setState(() => ({
      score: 0,
      board: this.newBoard(),
      won: false,
      over: false,
      keepPlaying: false
    }));
  };

  handlePlayerAction = (action: UserAction) => {
    if (action === Actions.USER_ACTION_RESTART) {
      this.handleGameRestart();
    } else {
      this.handleMoveMade(action);
    }
  };

  handleKeepPlaying = () => {
    this.setState({
      keepPlaying: true,
      won: false
    });
  };

  componentDidUpdate() {
    saveGame(this.prepareGameStateToSave());
  }

  prepareGameStateToSave(): any {
    return {
      ...this.state,
      board: this.state.board.toObject()
    };
  }

  render() {
    return (
      <React.Fragment>
        <Header
          title={MAX_SCORE + ""}
          score={this.state.score}
          bestScore={this.state.bestScore}
          onGameRestart={this.handleGameRestart}
        />
        <div className="game-container">
          <GameMessage
            won={this.state.won}
            over={this.state.over}
            onRetry={this.handleGameRestart}
            onKeepPlaying={this.handleKeepPlaying}
          />
          <Board
            keepPlaying={this.state.keepPlaying}
            onPlayerAction={this.handlePlayerAction}
            board={this.state.board}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Game;
