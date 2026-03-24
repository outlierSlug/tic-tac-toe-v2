import type { Cell } from "../types";

type SquareProps = {
  value: Cell,
  onClick: () => void;
};

export default function Square(props: SquareProps) {
  const {value, onClick} = props;

  // Set button className according to Square value
  let className = "square";
  if (value === "X") {
    className += " x-marker";
  } else if (value === "O") {
    className += " o-marker";
  }
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}
