import { useState, useCallback } from "react";

import { newMineField, openCell, chordCell, toggleCellFlag } from "./immutable-mine-field";

export function useMineField(rowCount, columnCount, mineCount) {
  const [mineField, setMineField] = useState(() => newMineField(rowCount, columnCount, mineCount));
  let state = 'NONE';
  if (mineField.isMineOpened) {
    state = 'FAILED';
  }
  else if(mineField.openedCount === mineField.rowCount * mineField.columnCount - mineField.mineCount) {
    state = 'SUCCEEDED';
  }

  const resetMineField = useCallback((rowCount, columnCount, mineCount) => {
    setMineField(newMineField(rowCount, columnCount, mineCount));
  }, [setMineField]);

  if (state === 'NONE') {
    const _openCell = (row, col) => setMineField(openCell(mineField, row, col));
    const _chordCell = (row, col) => setMineField(chordCell(mineField, row, col));
    const _flagCell = (row, col) => setMineField(toggleCellFlag(mineField, row, col));

    return {
      mineField,
      state,
      resetMineField,
      openCell: _openCell,
      chordCell: _chordCell,
      flagCell: _flagCell,
    };
  }
  else {
    const doNothing = () => {};
    return {
      mineField,
      state,
      resetMineField,
      openCell: doNothing,
      chordCell: doNothing,
      flagCell: doNothing,
    };
  }
}