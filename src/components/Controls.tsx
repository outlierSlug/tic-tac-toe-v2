type ControlsProps = {
  onUndo: () => void;
  onReset: () => void;
  isUndoDisabled: boolean;
  isResetDisabled: boolean;
};

export default function Controls(props: ControlsProps) {
  const {onUndo, onReset, isUndoDisabled, isResetDisabled} = props;
  return (
    <div className="game-controls">
      <button onClick={onUndo} disabled={isUndoDisabled}>
        Undo
      </button>
      <button onClick={onReset} disabled={isResetDisabled}>
        Reset
      </button>
    </div>
  );
}