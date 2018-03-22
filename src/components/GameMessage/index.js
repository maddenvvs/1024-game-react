// @flow
import * as React from "react";
import Button from "../Button";

import "./GameMessage.css";

type GameMessageProps = {
  won: boolean,
  over: boolean,
  onKeepPlaying: () => void,
  onRetry: () => void
};

function gameMessageClasses({ won, over }) {
  const classes = ["game-message"];
  if (won) {
    classes.push("game-won");
  } else if (over) {
    classes.push("game-over");
  }

  return classes.join(" ");
}

function GameMessage(props: GameMessageProps) {
  const { won, onKeepPlaying, onRetry } = props;
  return (
    <div className={gameMessageClasses(props)}>
      <div className="message-title">{won ? "You win!" : "Game over!"}</div>
      <div className="lower">
        {won && <Button caption="Keep going" onClick={onKeepPlaying} />}
        <Button caption="Try again" onClick={onRetry} />
      </div>
    </div>
  );
}

export default GameMessage;
