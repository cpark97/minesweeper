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

function findConnectedComponents(cells) {
  const components = [];
  const componentMap = Array.from(cells, (v) => Array.from(v, () => -1));

  const dir = [[-1, -1], [-1, 0], [-1, 1], [0, -1]];
  for (let row = 0; row < cells.length; ++row) {
    for (let col = 0; col < cells[row].length; ++col) {
      if (cells[row][col] !== 0) {
        continue;
      }
      if (componentMap[row][col] !== -1) {
        continue;
      }

      const componentID = components.length;
      const component = [[row, col]];
      componentMap[row][col] = componentID;
      for (let i = 0; i < component.length; ++i) {
        const [r, c] = component[i];
        if (cells[r][c] !== 0) {
          continue;
        }

        for (let j = 0; j < 8; ++j) {
          const tr = r + dr8[j];
          const tc = c + dc8[j];
          if (tr < 0 || tr >= cells.length || tc < 0 || tc >= cells[tr].length) {
            continue;
          }
          if (cells[tr][tc] === 0) {
            if (componentMap[tr][tc] === -1) {
              component.push([tr, tc]);
              componentMap[tr][tc] = componentID;
            }
          }
          else if (cells[tr][tc] > 0) {
            if (componentMap[tr][tc] !== componentID) {
              component.push([tr, tc]);
              componentMap[tr][tc] = componentID;
            }
          }
        }
      }

      components.push(component);
    }
  }

  return {components, componentMap};
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
    ...findConnectedComponents(cells),
    state: 'NONE',
  };
}

function checkGameSucceeded(cells, cellStates) {
  for (let r = 0; r < cells.length; ++r) {
    for (let c = 0; c < cells[r].length; ++c) {
      if (cells[r][c] !== -1 && cellStates[r][c] !== 1) {
        console.log(r, c);
        return false;
      }
    }
  }
  return true;
}

function openCells(mineField, cellsToOpen) {
  const {cells, cellStates, components, componentMap} = mineField;
  const newCellStates = [...cellStates];
  let isCellStatesModified = false;
  let isMineOpened = false;
  for (const [row, col] of cellsToOpen) {
    if (newCellStates[row][col] !== 0) {
      continue;
    }

    if (cells[row][col] === 0) {
      const component = components[componentMap[row][col]];
      for (const [r, c] of component) {
        if (cellStates[r][c] === 1) {
          continue;
        }
        if (newCellStates[r] === cellStates[r]) {
          newCellStates[r] = [...cellStates[r]];
        }
        newCellStates[r][c] = 1;
        isCellStatesModified = true;
      }
    }
    else {
      if (newCellStates[row] === cellStates[row]) {
        newCellStates[row] = [...cellStates[row]];
      }
      newCellStates[row][col] = 1;
      isCellStatesModified = true;

      if (cells[row][col] === -1) {
        isMineOpened = true;
      }
    }
  }

  if (!isCellStatesModified) {
    return mineField;
  }

  if (isMineOpened) {
    return {...mineField, cellStates: newCellStates, state: 'FAILED'};
  }

  if (checkGameSucceeded(cells, newCellStates)) {
    return {...mineField, cellStates: newCellStates, state: 'SUCCEED'};
  }

  return {...mineField, cellStates: newCellStates};
}

export function openCell(mineField, row, col) {
  return openCells(mineField, [[row, col]]);
}

export function chordCell(mineField, row, col) {
  const {cells, cellStates, components, componentMap} = mineField;
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