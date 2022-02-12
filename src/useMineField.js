import { useState, useMemo } from "react";

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

function findConnectedComponents({cells}) {
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

function openCells({cells, cellStates, components, componentMap}, cellsToOpen, setCellStates, setGameState) {
  const newCellStates = cellStates;
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
      }
    }
    else {
      if (newCellStates[row] === cellStates[row]) {
        newCellStates[row] = [...cellStates[row]];
      }
      newCellStates[row][col] = 1;

      if (cells[row][col] === -1) {
        isMineOpened = true;
      }
    }
  }

  setCellStates(newCellStates);

  if (isMineOpened) {
    setGameState('FAILED');
  }

  if (checkGameSucceeded(cells, newCellStates)) {
    setGameState('SUCCEEDED');
  }
}

function openCell({cells, cellStates, components, componentMap}, row, col, setCellStates, setGameState) {
  openCells({cells, cellStates, components, componentMap}, [[row, col]], setCellStates, setGameState);
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

function chordCell({cells, cellStates, components, componentMap}, row, col, setCellStates, setGameState) {
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

  openCells({cells, cellStates, components, componentMap}, closedCells, setCellStates, setGameState);
}

export function useMineField(rowCount, columnCount, mineCount) {
  const [boardConfig, setBoardConfig] = useState({rowCount, columnCount, mineCount});
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
  const [gameState, setGameState] = useState('NONE');

  const resetMineField = () => {
    const {rowCount, columnCount, mineCount} = boardConfig;
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
    setGameState('NONE');
  };

  const _setBoardConfig = (rowCount, columnCount, mineCount) => {
    setBoardConfig({rowCount, columnCount, mineCount});
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
    setGameState('NONE');
  };

  const {components, componentMap} = useMemo(() => findConnectedComponents({cells}), [cells]);

  if (gameState === 'NONE') {
    const _openCell = (row, col) => openCell({cells, cellStates, components, componentMap}, row, col, setCellStates, setGameState);
    const _flagCell = (row, col) => flagCell(row, col, cellStates, setCellStates);
    const _chordCell = (row, col) => chordCell({cells, cellStates, components, componentMap}, row, col, setCellStates, setGameState);

    return {
      cells,
      cellStates,
      gameState,
      rowCount: boardConfig.rowCount,
      columnCount: boardConfig.columnCount,
      mineCount: boardConfig.mineCount,
      openCell: _openCell,
      flagCell: _flagCell,
      chordCell: _chordCell,
      resetMineField,
      setBoardConfig: _setBoardConfig,
    };
  }
  else {
    const doNothing = () => {};
    return {
      cells,
      cellStates,
      gameState,
      rowCount: boardConfig.rowCount,
      columnCount: boardConfig.columnCount,
      mineCount: boardConfig.mineCount,
      openCell: doNothing,
      flagCell: doNothing,
      chordCell: doNothing,
      resetMineField,
      setBoardConfig: _setBoardConfig,
    };
  }
}