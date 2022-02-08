import { useMineField } from './useMineField';
import Board from './Board';

export function MineSweeper() {
  const rowCount = 10;
  const columnCount = 10;

  const {
    cells,
    cellStates,
    gameState,
    openCell,
    flagCell,
    chordCell,
    resetMineField,
  } = useMineField(rowCount, columnCount, 10);
  
  return (
    <div>
      <button onClick={resetMineField}>reset</button>
      <span>{gameState}</span>
      <Board 
        cells={cells}
        cellStates={cellStates}
        openCell={openCell}
        flagCell={flagCell}
        chordCell={chordCell}
      />
    </div>
  );
}

export default MineSweeper;