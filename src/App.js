import React, { useEffect, useReducer } from "react";
import Button from "./Components/Button";
import "./App.sass";

const ADD_DIGIT = "ADD_DIGIT";
const ADD_DOT = "ADD_DOT";
const ADD_OPERATOR = "ADD_OPERATOR";
const CLEAR = "CLEAR";
const DELETE = "DELETE";
const EVALUATE = "EVALUATE";
const CHANGE_SIGN = "CHANGE_SIGN";

const initialState = {
  currentVal: "",
  prevVal: "",
  operator: null,
};

const isNumberCorrect = (number) => {
  if (
    number === "" ||
    number == "Infinity" ||
    number == "-Infinity" ||
    number == "NaN"
  ) {
    return false;
  }

  return true;
};

const evaluate = (prev, current, operator) => {
  let result = "";
  switch (operator) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "÷":
    case "/":
      result = prev / current;
      break;
  }
  return result;
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case CHANGE_SIGN:
      if (!isNumberCorrect(state.currentVal) || state.currentVal === "0") {
        return state;
      }

      const parsed = parseFloat(state.currentVal);

      if (isNaN(parsed)) {
        return state;
      }

      return {
        ...state,
        currentVal: `${-1 * parsed}`,
      };

    case EVALUATE: {
      const { currentVal, prevVal, operator } = state;
      if (currentVal === "" || prevVal === "" || !operator) {
        return state;
      }

      const current = parseFloat(currentVal);
      const prev = parseFloat(prevVal);

      if (isNaN(current) || isNaN(prev)) {
        return state;
      }

      const result = evaluate(prev, current, operator);

      return {
        prevVal: "",
        operator: null,
        currentVal: `${result}`,
      };
    }

    case ADD_OPERATOR: {
      if (state.prevVal && state.currentVal) {
        const { currentVal, prevVal, operator } = state;
        if (currentVal === "" || prevVal === "" || !operator) {
          return state;
        }

        const current = parseFloat(currentVal);
        const prev = parseFloat(prevVal);

        if (isNaN(current) || isNaN(prev)) {
          return state;
        }

        const result = evaluate(prev, current, operator);

        return {
          prevVal: `${result}`,
          operator: payload,
          currentVal: "",
        };
      }

      if (state.operator) {
        return {
          ...state,
          operator: payload,
        };
      }

      if (!isNumberCorrect(state.currentVal)) {
        return state;
      }

      return {
        operator: payload,
        prevVal: state.currentVal,
        currentVal: "",
      };
    }

    case DELETE:
      if (!isNumberCorrect(state.currentVal)) {
        return {
          ...state,
          currentVal: "",
        };
      }

      if (state.currentVal.length === 2 && state.currentVal[0] === "-") {
        return {
          ...state,
          currentVal: "",
        };
      }

      return {
        ...state,
        currentVal: state.currentVal.slice(0, -1),
      };

    case CLEAR:
      return initialState;

    case ADD_DOT:
      if (!isNumberCorrect(state.currentVal)) {
        return {
          ...state,
          currentVal: "",
        };
      }
      if (state.currentVal.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentVal: state.currentVal + ".",
      };

    case ADD_DIGIT:
      if (payload === "0" && state.currentVal === "0") {
        return state;
      }

      if (!isNumberCorrect(state.currentVal) || state.currentVal === "0") {
        return {
          ...state,
          currentVal: payload,
        };
      }

      return {
        ...state,
        currentVal: state.currentVal + payload,
      };

    default:
      state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentVal, prevVal, operator } = state;

  const onDigitPress = (digit) => {
    dispatch({
      type: ADD_DIGIT,
      payload: digit,
    });
  };

  const onDotPress = () => {
    dispatch({
      type: ADD_DOT,
    });
  };

  const onClearPress = () => {
    dispatch({
      type: CLEAR,
    });
  };

  const onDeletePress = () => {
    dispatch({
      type: DELETE,
    });
  };

  const onOperatorPress = (operator) => {
    dispatch({
      type: ADD_OPERATOR,
      payload: operator,
    });
  };

  const onEvaluatePress = () => {
    dispatch({
      type: EVALUATE,
    });
  };

  const onChangeSign = () => {
    dispatch({
      type: CHANGE_SIGN,
    });
  };

  useEffect(() => {
    const processKey = (event) => {
      const key = event.key;
      console.log(event);
      console.log(key);
      switch (key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
          onDigitPress(`${key}`);
          break;
        case '*':      
        case '/':      
        case '+':      
        case '-':
          onOperatorPress(`${key}`);
          break;
        case '.':
          onDotPress();
          break;
        case 'Enter':
        case '=':
          onEvaluatePress();
          break;
        case 'Delete':
        case 'Backspace':
          onDeletePress();
          break;
        default:
          break;
      }
    }
    document.addEventListener('keydown', processKey);
    return () => document.removeEventListener('keydown', processKey);
  }, []);

  return (
    <div className="app__container">
      <div className="calculator__wrapper">
        <div className="calculator__display">
          <div className="calculator__prev">
            {prevVal} {operator}
          </div>
          <div className="calculator__current">{currentVal}</div>
        </div>

        <Button digit="AC" onPress={() => onClearPress()}></Button>
        <Button digit="DEL" onPress={() => onDeletePress()}></Button>
        <Button digit="÷" onPress={(digit) => onOperatorPress(digit)}></Button>

        <Button digit="7" onPress={(digit) => onDigitPress(digit)}></Button>
        <Button digit="8" onPress={(digit) => onDigitPress(digit)}></Button>
        <Button digit="9" onPress={(digit) => onDigitPress(digit)}></Button>
        <Button digit="*" onPress={(digit) => onOperatorPress(digit)}></Button>

        <Button digit="4" onPress={(digit) => onDigitPress(digit)}></Button>
        <Button digit="5" onPress={(digit) => onDigitPress(digit)}></Button>
        <Button digit="6" onPress={(digit) => onDigitPress(digit)}></Button>
        <Button digit="-" onPress={(digit) => onOperatorPress(digit)}></Button>

        <Button digit="1" onPress={(digit) => onDigitPress(digit)}></Button>
        <Button digit="2" onPress={(digit) => onDigitPress(digit)}></Button>
        <Button digit="3" onPress={(digit) => onDigitPress(digit)}></Button>
        <Button digit="+" onPress={(digit) => onOperatorPress(digit)}></Button>

        <Button digit="0" onPress={(digit) => onDigitPress(digit)}></Button>
        <Button digit="." onPress={() => onDotPress()}></Button>
        <Button digit="±" onPress={() => onChangeSign()}></Button>
        <Button digit="=" onPress={() => onEvaluatePress()}></Button>
      </div>
    </div>
  );
};

export default App;
