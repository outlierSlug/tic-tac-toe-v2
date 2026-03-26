import type { GameSettings } from "../types";

type SettingsProps = {
  gameStarted: boolean,
  gameSettings: GameSettings,
  onChangeGridSize: (evt: React.ChangeEvent<HTMLSelectElement>) => void,
  onChangeMode: (evt: React.ChangeEvent<HTMLSelectElement>) => void,
  onChangeOpponent: (evt: React.ChangeEvent<HTMLSelectElement>) => void,
  onChangePlayer: (evt:React.ChangeEvent<HTMLSelectElement>) => void,
  onChangeDifficulty: (evt:React.ChangeEvent<HTMLSelectElement>) => void,
  onRestoreDefaults: () => void
};

export default function Settings(props: SettingsProps) {
  const { gameStarted, gameSettings, 
          onChangeGridSize, onChangeMode, onChangeOpponent, 
          onChangePlayer, onChangeDifficulty, onRestoreDefaults } = props;
  return (
    <div className="settings-bar">
      <h2>Settings</h2>
      {/* Grid Size Select */}
      <label htmlFor="grid-size-select">Grid Size: </label>
      <select id="grid-size-select"
              value={gameSettings.gridSize}
              onChange={onChangeGridSize}
              disabled={gameStarted || gameSettings.player === "O"}>
        <option value="3">3x3</option>
      </select>
      <br></br>
      {/* Game Mode Select */}
      <label htmlFor="game-mode-select">Game Mode: </label>
      <select id="game-mode-select"
              value={gameSettings.gameMode}
              onChange={onChangeMode}
              disabled={gameStarted || gameSettings.player === "O"}>
        <option value="classic">Classic</option>
        <option value="endless">Endless</option>
      </select>
      <br></br>
      {/* Opponent Select */}
      <label htmlFor="opponent-select">Opponent: </label>
      <select id="opponent-select"
              value={gameSettings.opponent}
              onChange={onChangeOpponent}
              disabled={gameStarted || gameSettings.player === "O"}>
        <option value="local">Local</option>
        <option value="computer">Computer</option>
      </select>
      {gameSettings.opponent === "computer" && (
        <div>
          <label htmlFor="difficulty-select">Difficulty: </label>
          <select id="difficulty-select" 
                  value={gameSettings.difficulty}
                  onChange={onChangeDifficulty}
                  disabled={gameStarted || gameSettings.player === "O"}>
            <option value="easy">Easy</option>
            {/*<option value="hard" disabled>Hard</option>*/}
          </select>
          <br></br>
          <label htmlFor="player-select">Play As: </label>
          <select id="player-select" 
                  value={gameSettings.player}
                  onChange={onChangePlayer}
                  disabled={gameStarted || gameSettings.player === "O"}>
            <option value="X">X</option>
            <option value="O">O</option>
          </select>
        </div>
      )}
      <br></br>
      <br></br>
      {/* Restore Defaults Button*/}
      <button onClick={onRestoreDefaults} 
              title={"Restore settings to default"} 
              disabled={gameStarted || gameSettings.player === "O"}>
        Restore Defaults
      </button>
    </div>
  );
}