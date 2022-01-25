import { useState } from 'react';

import Board from './Board';

function generateBoard(rowCount, columnCount, mineCount) {
  const mines = [];
  while (mines.length < mineCount - 1) {
    const row = Math.floor(Math.random() * rowCount);
    const col = Math.floor(Math.random() * columnCount);
    if (mines.findIndex(([r, c]) => (r === row && c === col)) === -1) {
      mines.push([row, col]);
    }
  }

  const board = Array.from(
    {length: rowCount}, 
    () => Array.from(
      {length: columnCount}, 
      () => 0
    )
  );
  
  const dr = [-1, -1, -1, 0, 1, 1, 1, 0];
  const dc = [-1, 0, 1, 1, 1, 0, -1, -1];

  for (const [row, col] of mines) {
    for (let i = 0; i < 8; ++i) {
      const r = row + dr[i];
      const c = col + dc[i];
      if (r >= 0 && r < rowCount && c >= 0 && c < columnCount) {
        board[r][c] += 1;
      }
    }
  }
  for (const [row, col] of mines) {
    board[row][col] = -1;
  }

  return board;
}

export function MineSweeper(props) {
  const rowCount = 10;
  const columnCount = 10;

  const [board, setBoard] = useState(
    () => generateBoard(rowCount, columnCount, 10)
  );

  const [cellStates, setCellStates] = useState(
    () => Array.from(
      {length: rowCount}, 
      () => Array.from(
        {length: columnCount}, 
        () => 0
      )
    )
  );

  const [cursor, setCursor] = useState({cell: null, showCandidates: false});

  const reset = () => {
    setBoard(generateBoard(rowCount, columnCount, 10));
    setCellStates(Array.from(
      {length: rowCount}, 
      () => Array.from(
        {length: columnCount}, 
        () => 0
      )
    ));
    setCursor({cell: null, showCandidates: false});
  };
  
  return (
    <div>
      <button onClick={reset}>reset</button>
      <Board 
        rowCount={rowCount}
        columnCount={columnCount}
        board={board}
        cellStates={cellStates}
        setCellStates={setCellStates}
        cursor={cursor}
        setCursor={setCursor}
      />
    </div>
  );
}

export default MineSweeper;