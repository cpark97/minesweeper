import { useRef } from 'react';

import { useMineField } from './useMineField';
import { useStopWatch } from './useStopWatch';
import Board from './Board';
import { SevenSegments } from './SevenSegments';

export function MineSweeper() {
  const sw = useStopWatch();
  const handleChange = (newMineField) => {
    if (sw.state === 'RESET' && newMineField.openedCount > 0) {
      sw.resume();
    }
    else if (
      sw.state === 'RESUMED' && 
      (newMineField.openedCount === newMineField.rowCount * newMineField.columnCount - newMineField.mineCount ||
      newMineField.isMineOpened)
    ) {
      sw.pause();
    }
  };

  const {
    mineField,
    state,
    openCell,
    flagCell,
    chordCell,
    resetMineField,
  } = useMineField(10, 10, 10, handleChange);

  const reset = () => {
    resetMineField(mineField.rowCount, mineField.columnCount, mineField.mineCount);
    sw.reset();
  }

  const rowCountInput = useRef(null);
  const columnCountInput = useRef(null);
  const mineCountInput = useRef(null);
  
  return (
    <div>
      <div>
        <label htmlFor="row-count">rows</label>
        <input type="number" name="rowCount" id="row-count" min={1} defaultValue={mineField.rowCount} ref={rowCountInput} />
        <label htmlFor="column-count">cols</label>
        <input type="number" name="columnCount" id="column-count" min={1} defaultValue={mineField.columnCount} ref={columnCountInput} />
        <label htmlFor="mine-count">mines</label>
        <input type="number" name="mineCount" id="mine-count" min={1} max={mineField.rowCount * mineField.columnCount - 1} defaultValue={mineField.mineCount} ref={mineCountInput}/>
        <button onClick={() => resetMineField(rowCountInput.current.value, columnCountInput.current.value, mineCountInput.current.value)}>set</button>
      </div>
      <SevenSegments numDigits={3} value={mineField.mineCount - mineField.flagCount}/>
      <button onClick={reset}>reset</button>
      <SevenSegments numDigits={3} value={Math.floor(sw.elapsed / 1000)}/>
      <span>{state}</span>
      <Board 
        cells={mineField.cells}
        cellStates={mineField.cellStates}
        openCell={openCell}
        flagCell={flagCell}
        chordCell={chordCell}
      />
    </div>
  );
}

export default MineSweeper;