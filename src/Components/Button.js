import React from "react";

const Button = ({ digit, onPress }) => {
  return (
    <button className="calculator__button" onClick={() => onPress(digit)}>
      {digit}
    </button>
  );
};

export default Button;
