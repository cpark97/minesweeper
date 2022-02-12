import { useState, useCallback } from "react";

import { newMineField, openCell, chordCell, toggleCellFlag } from "./immutable-mine-field";

export function useMineField(rowCount, columnCount, mineCount) {
  const [mineField, setMineField] = useState(() => newMineField(rowCount, columnCount, mineCount));

  const resetMineField = useCallback((rowCount, columnCount, mineCount) => {
    setMineField(newMineField(rowCount, columnCount, mineCount));
  }, [setMineField]);

  if (mineField.state === 'NONE') {
    const _openCell = (row, col) => setMineField(openCell(mineField, row, col));
    const _chordCell = (row, col) => setMineField(chordCell(mineField, row, col));
    const _flagCell = (row, col) => setMineField(toggleCellFlag(mineField, row, col));

    return {
      mineField,
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
      resetMineField,
      openCell: doNothing,
      chordCell: doNothing,
      flagCell: doNothing,
    };
  }
}