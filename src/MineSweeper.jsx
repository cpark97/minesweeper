import { useRef, useReducer } from 'react';

import { useMineField } from './useMineField';
import Board from './Board';

function stopWatchReducer(state, action) {
  switch(action) {
    case 'RESET':
      if (state.state === 'RESET') {
        return state;
      }
      return {state: 'RESET', elapsed: 0, last: 0};
    
    case 'RESUME':
      if (state.state === 'RESUMED') {
        return state;
      }
      return {state: 'RESUMED', elapsed: state.elapsed, last: Date.now()};

    case 'UPDATE':
      if (state.state !== 'RESUMED') {
        return state;
      }
      else {
        const now = Date.now();
        return {state: 'RESUMED', elapsed: state.elapsed + (now - state.last), last: now};
      }

    case 'PAUSE':
      if (state.state !== 'RESUMED') {
        return state;
      }
      else {
        const now = Date.now();
        return {state: 'PAUSED', elapsed: state.elapsed + (now - state.last), last: now};
      }
  }

  throw new Error('stopWatchReducer: action error');
}

function useStopWatch() {
  const [state, dispatch] = useReducer(stopWatchReducer, {state: 'RESET', elapsed: 0, last: 0});
  const intervalID = useRef(0);

  const reset = () => {
    if (intervalID.current > 0) {
      clearInterval(intervalID.current);
      intervalID.current = 0;
    }
    dispatch('RESET');
  };
  const resume = () => {
    if (intervalID.current > 0) {
      return;
    }
    dispatch('RESUME');
    intervalID.current = setInterval(
      () => {
        dispatch('UPDATE');
      },
      1000
    );
  };
  const pause = () => {
    if (intervalID === 0) {
      return;
    }
    clearInterval(intervalID.current);
    intervalID.current = 0;

    dispatch('PAUSE');
  };

  return {state: state.state, elapsed: state.elapsed, reset, resume, pause};
}

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

  const sw = useStopWatch();

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
      <div>
        <span>{sw.elapsed / 1000}</span>
        <button onClick={() => sw.resume()}>start</button>
        <button onClick={() => sw.pause()}>pause</button>
        <button onClick={() => sw.reset()}>reset</button>
        <span>{sw.state}</span>
      </div>
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