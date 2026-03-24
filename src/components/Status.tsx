import type { Winner } from "../types";

type StatusProps = {
  xIsNext: boolean,
  winner: Winner
};

export default function Status(props: StatusProps) {
  const {xIsNext, winner} = props;

  // If the game is over, display winner or draw message.
  // Otherwise, show the next player.
  if (winner === "Draw") {
    return (
      <div className="draw">
        Draw!
      </div>
    );
  } else if (winner) {
    return (
      <div>
        Winner: <span className={winner === "X"? "x-marker" : "o-marker"}>{winner}</span>
      </div>
    );
  } else {
    return (
      <div>
        Next Player: <span className={xIsNext ? "x-marker" : "o-marker"}>{xIsNext ? "X" : "O"}</span>
      </div>
    );
  }
}