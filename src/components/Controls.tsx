type ControlsProps = {
  onUndo: () => void;
  onReset: () => void;
};

export default function Controls(props: ControlsProps) {
  const {onUndo, onReset} = props;
  return (
    <div className="game-controls">
      <button onClick={onUndo}>
        Undo
      </button>
      <button onClick={onReset}>
        Reset
      </button>
    </div>
  );
}