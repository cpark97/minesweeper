import { useState } from "react";

const dr8 = [-1, -1, -1, 0, 1, 1, 1, 0];
const dc8 = [-1, 0, 1, 1, 1, 0, -1, -1];

function generateRandomCells(rowCount, columnCount, mineCount) {
  const mines = [];
  while (mines.length < mineCount - 1) {
    const row = Math.floor(Math.random() * rowCount);
    const col = Math.floor(Math.random() * columnCount);
    if (mines.findIndex(([r, c]) => (r === row && c === col)) === -1) {
      mines.push([row, col]);
    }
  }

  const cells = Array.from(
    {length: rowCount}, 
    () => Array.from(
      {length: columnCount}, 
      () => 0
    )
  );

  for (const [row, col] of mines) {
    for (let i = 0; i < 8; ++i) {
      const r = row + dr8[i];
      const c = col + dc8[i];
      if (r >= 0 && r < rowCount && c >= 0 && c < columnCount) {
        cells[r][c] += 1;
      }
    }
  }
  for (const [row, col] of mines) {
    cells[row][col] = -1;
  }

  return cells;
}

function floodFill(row, col, cells, cellStates, newCellStates) {
  if (newCellStates[row] === cellStates[row]) {
    newCellStates[row] = [...cellStates[row]];
  }
  newCellStates[row][col] = 1;
  for (let i = 0; i < 8; ++i) {
    const r = row + dr8[i];
    const c = col + dc8[i];
    if (r >= 0 && r < cells.length && c >= 0 && c < cells[r].length && newCellStates[r][c] !== 1) {
      if (cells[r][c] === 0) {
        floodFill(r, c, cells, cellStates, newCellStates);
      }
      else if (cells[r][c] > 0) {
        if (newCellStates[r] === cellStates[r]) {
          newCellStates[r] = [...cellStates[r]];
        }
        newCellStates[r][c] = 1;
      }
    }
  }
}

function openCell(row, col, cells, cellStates, setCellStates) {
  if (cellStates[row][col] !== 0) {
    return;
  }

  if (cells[row][col] === 0) {
    const newCellStates = [...cellStates];
    floodFill(row, col, cells, cellStates, newCellStates);
    setCellStates(newCellStates);
  }
  else {
    const newCellStates = [...cellStates];
    newCellStates[row] = [...cellStates[row]];
    newCellStates[row][col] = 1;
    setCellStates(newCellStates);
  }
}

function flagCell(row, col, cellStates, setCellStates) {
  if (cellStates[row][col] === 1) {
    return;
  }

  const newBoard = [...cellStates];
  newBoard[row] = [...cellStates[row]];
  newBoard[row][col] = 2 - cellStates[row][col];
  setCellStates(newBoard);
}

function chordCell(row, col, cells, cellStates, setCellStates) {
  if (cellStates[row][col] !== 1 || cells[row][col] <= 0) {
    return;
  }

  let flagCnt = 0;
  const closedCells = [];
  for (let i = 0; i < 8; ++i) {
    const r = row + dr8[i];
    const c = col + dc8[i];
    if (r < 0 || r >= cellStates.length || c < 0 || c >= cellStates[r].length) {
      continue;
    }
    if (cellStates[r][c] === 2) {
      ++flagCnt;
    }
    else if (cellStates[r][c] === 0) {
      closedCells.push([r, c]);
    }
  }

  if (flagCnt != cells[row][col]) {
    return;
  }

  const newCellStates = [...cellStates];
  for (const [r, c] of closedCells) {
    if (cells[r][c] === 0) {
      floodFill(r, c, cells, cellStates, newCellStates);
    }
    else if (cells[r][c] > 0) {
      if (newCellStates[r] === cellStates[r]) {
        newCellStates[r] = [...cellStates[r]];
      }
      newCellStates[r][c] = 1;
    }
    else {
      // Todo: game over
    }
  }
  setCellStates(newCellStates);
}

export function useMineField(rowCount, columnCount, mineCount) {
  const [cells, setCells] = useState(() => generateRandomCells(rowCount, columnCount, mineCount));
  const [cellStates, setCellStates] = useState(
    () => Array.from(
      {length: rowCount},
      () => Array.from(
        {length: columnCount},
        () => 0
      )
    )
  );

  const resetMineField = () => {
    setCells(generateRandomCells(rowCount, columnCount, mineCount));
    setCellStates(
      Array.from(
        {length: rowCount},
        () => Array.from(
          {length: columnCount},
          () => 0
        )
      )
    )
  };

  const _openCell = (row, col) => openCell(row, col, cells, cellStates, setCellStates);
  const _flagCell = (row, col) => flagCell(row, col, cellStates, setCellStates);
  const _chordCell = (row, col) => chordCell(row, col, cells, cellStates, setCellStates);

  return {
    cells,
    cellStates,
    openCell: _openCell,
    flagCell: _flagCell,
    chordCell: _chordCell,
    resetMineField,
  };
}