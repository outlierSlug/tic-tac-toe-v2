import type { Cell } from "../types";

type SquareProps = {
  value: Cell,
  onClick: () => void;
};

export default function Square(props: SquareProps) {
  const {value, onClick} = props;
  return (
    <button onClick={onClick}>
      {value}
    </button>
  );
}
