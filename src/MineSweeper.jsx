import { useRef, useState } from 'react';

import { useMineField } from './useMineField';
import { useStopWatch } from './useStopWatch';
import Board from './Board';
import { SevenSegments } from './SevenSegments';
import { ResetButton } from './ResetButton';
import { Modal } from './Modal';

import './MineSweeper.css';

const levels = Object.freeze({
  beginner: {rowCount: 8, columnCount: 8, mineCount: 10},
  intermediate: {rowCount: 16, columnCount: 16, mineCount: 40},
  expert: {rowCount: 16, columnCount: 30, mineCount: 99},
});

function CustomLevelModal({show, defaultRowCount, defaultColumnCount, defaultMineCount, onOk, onCancel}) {
  const rowCountInput = useRef(null);
  const columnCountInput = useRef(null);
  const mineCountInput = useRef(null);

  const handleOk = () => {
    onOk({
      rowCount: rowCountInput.current.value,
      columnCount: columnCountInput.current.value,
      mineCount: mineCountInput.current.value,
    });
  };

  return (
    <Modal show={show}>
      <div className="custom-level-modal">
        <label htmlFor="row-count">rows</label>
        <input type="number" name="rowCount" id="row-count" min={1} defaultValue={defaultRowCount} ref={rowCountInput} />
        <br/>
        <label htmlFor="column-count">cols</label>
        <input type="number" name="columnCount" id="column-count" min={1} defaultValue={defaultColumnCount} ref={columnCountInput} />
        <br/>
        <label htmlFor="mine-count">mines</label>
        <input type="number" name="mineCount" id="mine-count" min={1} defaultValue={defaultMineCount} ref={mineCountInput}/>
        <br/>
        <button onClick={onCancel}>cancel</button>
        <button onClick={handleOk}>ok</button>
      </div>
    </Modal>
  );
}

export function MineSweeper() {
  const sw = useStopWatch();
  const [resetButtonFace, setResetButtonFace] = useState('normal');
  const handleChange = (newMineField) => {
    if (sw.state === 'RESET' && newMineField.openedCount > 0) {
      sw.resume();
    }
    else if (newMineField.openedCount === newMineField.rowCount * newMineField.columnCount - newMineField.mineCount) {
      sw.pause();
      setResetButtonFace('succeeded');
    }
    else if (newMineField.isMineOpened) {
      sw.pause();
      setResetButtonFace('failed');
    }
  };

  const {
    mineField,
    state,
    openCell,
    flagCell,
    chordCell,
    resetMineField,
  } = useMineField(8, 8, 10, handleChange);

  const reset = () => {
    resetMineField(mineField.rowCount, mineField.columnCount, mineField.mineCount);
    sw.reset();
    setResetButtonFace('normal');
  };

  const handleLevelChange = (e) => {
    if (e.target.checked) {
      const level = levels[e.target.value];
      resetMineField(level.rowCount, level.columnCount, level.mineCount);
      sw.reset();
      setResetButtonFace('normal');
    }
  };

  const [customLevelModalShow, setCustomLevelModalShow] = useState(false);
  const handleCustomLevelClick = () => {
    setCustomLevelModalShow(true);
  };
  const handleCustomLevelModalCancel = () => {
    setCustomLevelModalShow(false);
  }
  const handleCustomLevelModalOk = (level) => {
    setCustomLevelModalShow(false);
    resetMineField(level.rowCount, level.columnCount, level.mineCount);
    sw.reset();
    setResetButtonFace('normal');
  }
  
  return (
    <div>
      <CustomLevelModal
        show={customLevelModalShow}
        defaultRowCount={mineField.rowCount}
        defaultColumnCount={mineField.columnCount}
        defaultMineCount={mineField.mineCount}
        onCancel={handleCustomLevelModalCancel}
        onOk={handleCustomLevelModalOk}
      />
      <ul>
        <li>
          <input type="radio" name="board" id="level__beginner" value="beginner" onChange={handleLevelChange} defaultChecked/>
          <label htmlFor="level__beginner">beginner</label>
        </li>
        <li>
          <input type="radio" name="board" id="level__intermediate" onChange={handleLevelChange} value="intermediate"/>
          <label htmlFor="level__intermediate">intermediate</label>
        </li>
        <li>
          <input type="radio" name="board" id="level__expert" onChange={handleLevelChange} value="expert"/>
          <label htmlFor="level__expert">expert</label>
        </li>
        <li>
          <input type="radio" name="board" id="level__custom" onClick={handleCustomLevelClick} value="custom"/>
          <label htmlFor="level__custom">custom</label>
        </li>
      </ul>
      <div className="mine-sweeper">
        <div className="mine-sweeper__header">
          <SevenSegments numDigits={3} value={mineField.mineCount - mineField.flagCount}/>
          <ResetButton onClick={reset} face={resetButtonFace}></ResetButton>
          <SevenSegments numDigits={3} value={Math.floor(sw.elapsed / 1000)}/>
        </div>
        <Board 
          cells={mineField.cells}
          cellStates={mineField.cellStates}
          openCell={openCell}
          flagCell={flagCell}
          chordCell={chordCell}
        />
      </div>
    </div>
  );
}

export default MineSweeper;