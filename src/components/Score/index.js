// @flow
import * as React from "react";
import "./Score.css";

type ScoreProps = { name: string, value: number };
type ScoreState = { scoreAddition: number };

class Score extends React.Component<ScoreProps, ScoreState> {
  static defaultProps = {
    value: 0
  };

  state = {
    scoreAddition: 0
  };

  componentWillReceiveProps(newProps: ScoreProps) {
    this.setState({
      scoreAddition: newProps.value - this.props.value
    });
  }

  render() {
    const { name, value } = this.props;
    const { scoreAddition } = this.state;

    return (
      <div className={`score-container score-${name}`}>
        <div className="score-name">{name}</div>
        <div className="score-value">{value}</div>
        {scoreAddition > 0 && (
          <div key={Date.now()} className="score-addition">
            +{scoreAddition}
          </div>
        )}
      </div>
    );
  }
}

export default Score;
