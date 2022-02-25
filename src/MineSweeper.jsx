import { useRef, useState } from 'react';

import { useMineField } from './useMineField';
import { useRoughStopwatch } from './useStopWatch';
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
        <div>
          <label htmlFor="column-count">Width</label>
          <input type="number" name="columnCount" id="column-count" min={1} defaultValue={defaultColumnCount} ref={columnCountInput} />
        </div>
        <div>
          <label htmlFor="row-count">Height</label>
          <input type="number" name="rowCount" id="row-count" min={1} defaultValue={defaultRowCount} ref={rowCountInput} />
        </div>
        <div>
          <label htmlFor="mine-count">Mines</label>
          <input type="number" name="mineCount" id="mine-count" min={1} defaultValue={defaultMineCount} ref={mineCountInput}/>
        </div>
        <div>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={handleOk}>Ok</button>
        </div>
      </div>
    </Modal>
  );
}

function Dropdown(props) {
  const [show, setShow] = useState(false);
  const handleHeaderClick = () => {
    setShow(!show);
  }
  const handleMenuClick = (e) => {
    if (e.target.parentElement !== e.currentTarget) {
      return;
    }
    if (!e.target.classList.contains('dropdown-item')) {
      return;
    }

    setShow(false);
  }

  const className = ['dropdown'];
  if (show) {
    className.push('dropdown--open');
  }

  return (
    <div className={className.join(' ')}>
      <span className="dropdown__header" onClick={handleHeaderClick}>{props.header}</span>
      <div className="dropdown__menu-container">
        <ul className="dropdown__menu" onClick={handleMenuClick}>
          {props.children}
        </ul>
      </div>
    </div>
  );
}

function LevelMenu({current, onClick}) {
  const handleClick = (value) => {
    return () => {
      onClick(value);
    };
  };

  return (
    <Dropdown header="Game ▼">
      <li className="dropdown-item" onClick={handleClick('beginner')}>
        <input type="radio" name="level" disabled checked={current === 'beginner'}/>beginner
      </li>
      <li className="dropdown-item" onClick={handleClick('intermediate')}>
        <input type="radio" name="level" disabled checked={current === 'intermediate'}/>intermediate
      </li>
      <li className="dropdown-item" onClick={handleClick('expert')}>
        <input type="radio" name="level" disabled checked={current === 'expert'}/>expert
      </li>
      <li className="dropdown-item" onClick={handleClick('custom')}>
        <input type="radio" name="level" disabled checked={current === 'custom'}/>custom
      </li>
    </Dropdown>
  );
}

export function MineSweeper() {
  const sw = useRoughStopwatch();
  const [resetButtonFace, setResetButtonFace] = useState('normal');
  const handleChange = (newMineField) => {
    if (newMineField.openedCount === newMineField.rowCount * newMineField.columnCount - newMineField.mineCount) {
      sw.pause();
      setResetButtonFace('succeeded');
    }
    else if (newMineField.isMineOpened) {
      sw.pause();
      setResetButtonFace('failed');
    }
    else if (sw.state === 'RESET' && newMineField.openedCount > 0) {
      sw.resume();
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

  const [level, setLevel] = useState('beginner');
  const [customLevelModalShow, setCustomLevelModalShow] = useState(false);
  const handleLevelMenuClick = (value) => {
    if (value === 'custom') {
      setCustomLevelModalShow(true);
    }
    else if (value !== level) {
      setLevel(value);
      const level = levels[value];
      resetMineField(level.rowCount, level.columnCount, level.mineCount);
      sw.reset();
      setResetButtonFace('normal');
    }
  };

  const handleCustomLevelModalCancel = () => {
    setCustomLevelModalShow(false);
  }
  const handleCustomLevelModalOk = (level) => {
    setLevel('custom');
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
      <LevelMenu current={level} onClick={handleLevelMenuClick}/>
      <div className="mine-sweeper">
        <div className="mine-sweeper__header">
          <SevenSegments numDigits={3} value={mineField.mineCount - mineField.flagCount}/>
          <ResetButton onClick={reset} face={resetButtonFace}></ResetButton>
          <SevenSegments numDigits={3} value={sw.elapsedSeconds}/>
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