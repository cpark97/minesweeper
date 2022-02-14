const dr8 = [-1, -1, -1, 0, 1, 1, 1, 0];
const dc8 = [-1, 0, 1, 1, 1, 0, -1, -1];

function generateRandomCells(rowCount, columnCount, mineCount) {
  const mines = [];
  while (mines.length < mineCount) {
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

export function newMineField(rowCount, columnCount, mineCount) {
  const cells = generateRandomCells(rowCount, columnCount, mineCount);
  const cellStates = Array.from(cells, (row) => Array.from(row, () => 0));
  return {
    rowCount,
    columnCount,
    mineCount,
    cells,
    cellStates,
    openedCount: 0,
    isMineOpened: false,
  };
}

// flood fill 될 곳에 깃발이 있는 경우 그 칸은 열리지 않고 숫자칸과 마찬가지로 취급하여 flood fill이 막힌다 (arbiter)
function openCells(mineField, cellsToOpen) {
  const {rowCount, columnCount, mineCount, cells, cellStates, openedCount} = mineField;
  const newCellStates = [...cellStates];
  let newIsMineOpened = false;
  let newOpenedCount = openedCount;

  for (const [row, col] of cellsToOpen) {
    if (newCellStates[row][col] !== 0) {
      continue;
    }

    if (newCellStates[row] === cellStates[row]) {
      newCellStates[row] = [...cellStates[row]];
    }
    newCellStates[row][col] = 1;
    newOpenedCount += 1;

    if (cells[row][col] !== 0) {
      newIsMineOpened = newIsMineOpened || (cells[row][col] === -1);
      continue;
    }

    // Flood Fill
    const queue = [[row, col]];
    let front = 0;
    while (front < queue.length) {
      const [r, c] = queue[front];
      front += 1;
      for (let i = 0; i < 8; ++i) {
        const tr = r + dr8[i];
        const tc = c + dc8[i];

        if (tr < 0 || tr >= rowCount || tc < 0 || tc >= columnCount) { continue; }
        if (newCellStates[tr][tc] !== 0) { continue; }

        if (newCellStates[tr] === cellStates[tr]) {
          newCellStates[tr] = [...cellStates[tr]];
        }
        newCellStates[tr][tc] = 1;
        newOpenedCount += 1;
        
        if (cells[tr][tc] === 0) {
          queue.push([tr, tc]);
        }
      }
    }
  }

  if (newOpenedCount === openedCount) {
    return mineField;
  }

  const newMineField = {
    ...mineField,
    cellStates: newCellStates,
    openedCount: newOpenedCount,
    isMineOpened: newIsMineOpened,
  };

  return newMineField;
}

export function openCell(mineField, row, col) {
  return openCells(mineField, [[row, col]]);
}

export function chordCell(mineField, row, col) {
  const {cells, cellStates} = mineField;
  if (cellStates[row][col] !== 1 || cells[row][col] <= 0) {
    return mineField;
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
    return mineField;
  }

  return openCells(mineField, closedCells);
}

export function toggleCellFlag(mineField, row, col) {
  const {cellStates} = mineField;
  if (cellStates[row][col] === 1) {
    return mineField;
  }

  const newCellStates = [...cellStates];
  newCellStates[row] = [...cellStates[row]];
  newCellStates[row][col] = 2 - cellStates[row][col];
  return {...mineField, cellStates: newCellStates};
}