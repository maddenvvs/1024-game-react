// @flow
import * as React from "react";
import Game from "../Game";

import "./App.css";

class App extends React.Component<{}> {
  renderGameExplanation() {
    return (
      <p className="game-explanation">
        <strong className="important">How to play:</strong> Use your{" "}
        <strong>arrow keys</strong> (or <strong>swipe</strong>) to move the
        tiles and merge them. Try to get to the <strong>1024 tile!</strong>
      </p>
    );
  }

  render() {
    return (
      <div className="container">
        <Game />
        {this.renderGameExplanation()}
      </div>
    );
  }
}

export default App;
