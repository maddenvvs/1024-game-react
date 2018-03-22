// @flow
import * as React from "react";
import Score from "../Score";
import Button from "../Button";
import "./Header.css";

type HeaderProps = {
  title: string,
  score: number,
  bestScore: number,
  onGameRestart: () => void
};

function Header(props: HeaderProps) {
  const { title, score, bestScore, onGameRestart } = props;

  return (
    <div className="header">
      <h1 className="title">{title}</h1>
      <div className="about-game">
        <div className="scores-container">
          <Score name="current" value={score} />
          <Score name="best" value={bestScore} />
        </div>
        <Button caption="New Game" onClick={onGameRestart} />
      </div>
    </div>
  );
}

export default Header;
