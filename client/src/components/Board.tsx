import type { GameBoard } from "../types";
import Square from "./Square";

type BoardProps = {
  board: GameBoard,
  onClick: (index: number) => void,
  winningSquares: number[],
  expiringSquare: number | null
};

export default function Board(props: BoardProps) {
  const {board, onClick, winningSquares, expiringSquare} = props;
  return (
    <div className="board">
      <div className="board-row">
        <Square value={board[0]} onClick={() => onClick(0)} isWinningSquare={winningSquares.includes(0)} isExpiring={expiringSquare === 0}/>
        <Square value={board[1]} onClick={() => onClick(1)} isWinningSquare={winningSquares.includes(1)} isExpiring={expiringSquare === 1}/>
        <Square value={board[2]} onClick={() => onClick(2)} isWinningSquare={winningSquares.includes(2)} isExpiring={expiringSquare === 2}/>
      </div>
      <div className="board-row">
        <Square value={board[3]} onClick={() => onClick(3)} isWinningSquare={winningSquares.includes(3)} isExpiring={expiringSquare === 3}/>
        <Square value={board[4]} onClick={() => onClick(4)} isWinningSquare={winningSquares.includes(4)} isExpiring={expiringSquare === 4}/>
        <Square value={board[5]} onClick={() => onClick(5)} isWinningSquare={winningSquares.includes(5)} isExpiring={expiringSquare === 5}/>
      </div>
      <div className="board-row">
        <Square value={board[6]} onClick={() => onClick(6)} isWinningSquare={winningSquares.includes(6)} isExpiring={expiringSquare === 6}/>
        <Square value={board[7]} onClick={() => onClick(7)} isWinningSquare={winningSquares.includes(7)} isExpiring={expiringSquare === 7}/>
        <Square value={board[8]} onClick={() => onClick(8)} isWinningSquare={winningSquares.includes(8)} isExpiring={expiringSquare === 8}/>
      </div>
    </div>
  );
}
