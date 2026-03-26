type ControlsProps = {
  onUndo: () => void,
  onRedo: () => void,
  onReset: () => void,
  isUndoDisabled: boolean,
  isRedoDisabled: boolean,
  isResetDisabled: boolean
};

export default function Controls(props: ControlsProps) {
  const {onUndo, onReset, onRedo, isUndoDisabled, isRedoDisabled, isResetDisabled} = props;
  return (
    <div className="game-controls">
      <button onClick={onUndo} disabled={isUndoDisabled}>
        Undo
      </button>
      <button onClick={onRedo} disabled={isRedoDisabled}>
        Redo
      </button>
      <button onClick={onReset} disabled={isResetDisabled}>
        Reset
      </button>
    </div>
  );
}