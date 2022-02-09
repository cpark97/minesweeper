import { useRef } from 'react';

import { useMineField } from './useMineField';
import Board from './Board';

export function MineSweeper() {
  const {
    cells,
    cellStates,
    gameState,
    rowCount,
    columnCount,
    mineCount,
    openCell,
    flagCell,
    chordCell,
    resetMineField,
    setBoardConfig,
  } = useMineField(10, 10, 10);

  const rowCountInput = useRef(null);
  const columnCountInput = useRef(null);
  const mineCountInput = useRef(null);
  
  return (
    <div>
      <div>
        <label htmlFor="row-count">rows</label>
        <input type="number" name="rowCount" id="row-count" min={1} defaultValue={rowCount} ref={rowCountInput} />
        <label htmlFor="column-count">cols</label>
        <input type="number" name="columnCount" id="column-count" min={1} defaultValue={columnCount} ref={columnCountInput} />
        <label htmlFor="mine-count">mines</label>
        <input type="number" name="mineCount" id="mine-count" min={1} max={rowCount * columnCount - 1} defaultValue={mineCount} ref={mineCountInput}/>
        <button onClick={() => setBoardConfig(rowCountInput.current.value, columnCountInput.current.value, mineCountInput.current.value)}>set</button>
      </div>
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