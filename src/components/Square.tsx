import type { Cell } from "../types";

type SquareProps = {
  value: Cell,
  onClick: () => void;
  isWinningSquare: boolean;
};

export default function Square(props: SquareProps) {
  const {value, onClick, isWinningSquare} = props;

  // Set button className according to Square value
  let className = "square";
  if (value === "X") {
    className += " x-marker";
  } else if (value === "O") {
    className += " o-marker";
  }

  // If this square is part of the winning combination, highlight it
  if (isWinningSquare) {
    className += " highlight";
  }
  
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}
