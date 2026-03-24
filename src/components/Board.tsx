import type { GameBoard } from "../types";
import Square from "./Square";

type BoardProps = {
  board: GameBoard;
  onClick: (index: number) => void;
};

export default function Board(props: BoardProps) {
  const {board, onClick} = props;
  return (
    <>
      <div>
        <Square value={board[0]} onClick={() => onClick(0)}/>
        <Square value={board[1]} onClick={() => onClick(1)}/>
        <Square value={board[2]} onClick={() => onClick(2)}/>
      </div>
      <div>
        <Square value={board[3]} onClick={() => onClick(3)}/>
        <Square value={board[4]} onClick={() => onClick(4)}/>
        <Square value={board[5]} onClick={() => onClick(5)}/>
      </div>
      <div>
        <Square value={board[6]} onClick={() => onClick(6)}/>
        <Square value={board[7]} onClick={() => onClick(7)}/>
        <Square value={board[8]} onClick={() => onClick(8)}/>
      </div>
    </>
  );
}
