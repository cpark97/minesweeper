import { useState } from 'react';

import './Board.css'

function preventDefault(e) {
  e.preventDefault();
}

function Cell(props) {
  const className = [
    'board__cell',
    (props.state === 1) ? 'board__cell--open' : 'board__cell--close',
  ].join(' ');
  let displayValue = null;
  if (props.state === 1) {
    if (props.value === 0) {
      displayValue = null;
    } else if (props.value === -1) {
      displayValue = '@';
    } else {
      displayValue = props.value;
    }
  }
  else if (props.state === 2) {
    displayValue = 'F';
  }
  return (
    <td className={className} onClick={props.onClick} onContextMenu={props.onContextMenu}>{displayValue}</td>
  );
}

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


const dr4 = [-1, 0, 1, 0];
const dc4 = [0, 1, 0, -1];
function floodFill(row, col, board, cellStates) {
  cellStates[row][col] = 1;
  for (let i = 0; i < 4; ++i) {
    const r = row + dr4[i];
    const c = col + dc4[i];
    if (r >= 0 && r < board.length && c >= 0 && c < board[r].length && cellStates[r][c] !== 1) {
      if (board[r][c] === 0) {
        floodFill(r, c, board, cellStates);
      }
      else if (board[r][c] > 0) {
        cellStates[r][c] = 1;
      }
    }
  }
}

function onCellLeftClick(e, row, col, board, cellStates, setCellStates) {
  if (e.button !== 0) {
    return;
  }
  if (cellStates[row][col] !== 0) {
    return;
  }

  if (board[row][col] === 0) {
    const newCellStates = Array.from(cellStates, (v) => [...v]);
    floodFill(row, col, board, newCellStates);
    setCellStates(newCellStates);
  }
  else {
    const newCellStates = [...cellStates];
    newCellStates[row] = [...cellStates[row]];
    newCellStates[row][col] = 1;
    setCellStates(newCellStates);
  }
}

function onCellRightClick(e, row, col, cellStates, setCellStates) {
  e.preventDefault();
  if (cellStates[row][col] === 1) {
    return;
  }

  const newBoard = [...cellStates];
  newBoard[row] = [...cellStates[row]];
  newBoard[row][col] = 2 - cellStates[row][col];
  setCellStates(newBoard);
}

export function Board(props) {
  const [board, setBoard] = useState(
    () => generateBoard(props.rowCount, props.columnCount, 10)
  );

  const [cellStates, setCellStates] = useState(
    () => Array.from(
      {length: props.rowCount}, 
      () => Array.from(
        {length: props.columnCount}, 
        () => 0
      )
    )
  );

  const rows = [];
  for (let i = 0; i < props.rowCount; ++i) {
    const cells = [];
    for (let j = 0; j < props.columnCount; ++j) {
      const onClick = (e) => onCellLeftClick(e, i, j, board, cellStates, setCellStates);
      const onContextMenu = (e) => onCellRightClick(e, i, j, cellStates, setCellStates);
      cells.push(<Cell key={j} state={cellStates[i][j]} value={board[i][j]} onClick={onClick} onContextMenu={onContextMenu} />);
    }
    rows.push(<tr key={i}>{cells}</tr>);
  }
  return (
    <table className='board'>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

export default Board;