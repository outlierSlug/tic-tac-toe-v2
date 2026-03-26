import type { Cell } from "../types";

type SquareProps = {
  value: Cell,
  onClick: () => void,
  isWinningSquare: boolean,
  isExpiring: boolean
};

export default function Square(props: SquareProps) {
  const {value, onClick, isWinningSquare, isExpiring} = props;

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

  // If this square is expiring on this next turn, gray it out
  if (isExpiring) {
    className += " expiring"
  }
  
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}
