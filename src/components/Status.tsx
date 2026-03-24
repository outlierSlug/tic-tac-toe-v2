import type { Winner } from "../types";

type StatusProps = {
  xIsNext: boolean,
  winner: Winner
};

export default function Status(props: StatusProps) {
  const {xIsNext, winner} = props;
  if (winner) {
    return (
      <div>
        Winner: {winner}
      </div>
    );
  } else {
    return (
      <div>
        Next Player: {xIsNext ? "X" : "O"}
      </div>
    );
  }
}