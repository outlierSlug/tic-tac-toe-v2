import type { Winner } from "../types";

type GameInfoProps = {
  xIsNext: boolean,
  winner: Winner
};

export default function GameInfo(props: GameInfoProps) {
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