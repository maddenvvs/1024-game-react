// @flow
import * as React from "react";

import "./Button.css";

type ButtonProps = { caption: string, onClick: () => void };

function Button(props: ButtonProps) {
  const { caption, onClick } = props;

  return (
    <button onClick={onClick} className="simple-button">
      {caption}
    </button>
  );
}

export default Button;
