import type { Winner } from "../types";

type StatusProps = {
  xIsNext: boolean,
  winner: Winner,
  isConnecting: boolean
};

export default function Status(props: StatusProps) {
  const {xIsNext, winner, isConnecting} = props;

  // If the game is over, display winner or draw message.
  // Otherwise, show the next player.
  // If client is still connecting to server, show loading state.
  if (isConnecting) {
    return (
      <div className="status">
        <p>Connecting to server<span className="connecting-dots"></span></p>
      </div>
    );
  } else if (winner === "Draw") {
    return (
      <div className="status">
        Draw!
      </div>
    );
  } else if (winner) {
    return (
      <div className="status">
        Winner: <span className={winner === "X"? "x-marker" : "o-marker"}>{winner}</span>
      </div>
    );
  } else {
    return (
      <div className="status">
        Next Player: <span className={xIsNext ? "x-marker" : "o-marker"}>{xIsNext ? "X" : "O"}</span>
      </div>
    );
  }
}