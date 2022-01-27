import { useState } from 'react';

import Cell from './Cell';
import './Board.css';

const dr8 = [-1, -1, -1, 0, 1, 1, 1, 0];
const dc8 = [-1, 0, 1, 1, 1, 0, -1, -1];
function floodFill(row, col, board, cellStates, newCellStates) {
  if (newCellStates[row] === cellStates[row]) {
    newCellStates[row] = [...cellStates[row]];
  }
  newCellStates[row][col] = 1;
  for (let i = 0; i < 8; ++i) {
    const r = row + dr8[i];
    const c = col + dc8[i];
    if (r >= 0 && r < board.length && c >= 0 && c < board[r].length && newCellStates[r][c] !== 1) {
      if (board[r][c] === 0) {
        floodFill(r, c, board, cellStates, newCellStates);
      }
      else if (board[r][c] > 0) {
        if (newCellStates[r] === cellStates[r]) {
          newCellStates[r] = [...cellStates[r]];
        }
        newCellStates[r][c] = 1;
      }
    }
  }
}

function openCell(row, col, board, cellStates, setCellStates) {
  if (cellStates[row][col] !== 0) {
    return;
  }

  if (board[row][col] === 0) {
    const newCellStates = [...cellStates];
    floodFill(row, col, board, cellStates, newCellStates);
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

function chordCell(row, col, board, cellStates, setCellStates) {
  if (cellStates[row][col] !== 1 || board[row][col] <= 0) {
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

  if (flagCnt != board[row][col]) {
    return;
  }

  const newCellStates = [...cellStates];
  for (const [r, c] of closedCells) {
    if (board[r][c] === 0) {
      floodFill(r, c, board, cellStates, newCellStates);
    }
    else if (board[r][c] > 0) {
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

export function Board(props) {
  const {board, cellStates, setCellStates, cursor, setCursor} = props;

  const rows = [];
  for (let i = 0; i < props.rowCount; ++i) {
    const cells = [];
    for (let j = 0; j < props.columnCount; ++j) {
      const active = (cursor.cell !== null) &&
                      ((cursor.cell[0] === i && cursor.cell[1] === j) || 
                      (cursor.showCandidates && Math.abs(cursor.cell[0] - i) <= 1 && Math.abs(cursor.cell[1] - j) <= 1));
      cells.push(
        <Cell key={j} 
          state={cellStates[i][j]} 
          value={board[i][j]} 
          active={active}
          cursor={cursor}
          setCursor={(showCandidates) => setCursor({cell: [i, j], showCandidates})}
          clearCursor={() => setCursor({cell: null, showCandidates: false})}
          openCell={() => openCell(i, j, board, cellStates, setCellStates)}
          flagCell={() => flagCell(i, j, cellStates, setCellStates)}
          chordCell={() => chordCell(i, j, board, cellStates, setCellStates)}
        />
      );
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