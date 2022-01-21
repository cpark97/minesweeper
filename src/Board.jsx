import { useState } from 'react';

import './Board.css'

function preventDefault(e) {
  e.preventDefault();
}

function mouse(e) {
  console.log(e.type, e.button, e.buttons);
}

function Cell(props) {
  const className = [
    'board__cell',
    'board__cell--close',
  ];
  if (props.state === 1) {
    className[1] = 'board__cell--open';
  }
  else if (props.hint) {
    className[1] = 'board__cell--hint';
  }

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
    <td className={className.join(' ')} 
        onClick={props.onClick} 
        onContextMenu={props.onContextMenu} 
        onDragStart={preventDefault}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
    >
      {displayValue}
    </td>
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

const dr8 = [-1, -1, -1, 0, 1, 1, 1, 0];
const dc8 = [-1, 0, 1, 1, 1, 0, -1, -1];
const dr4 = [-1, 0, 1, 0];
const dc4 = [0, 1, 0, -1];
function floodFill(row, col, board, cellStates) {
  cellStates[row][col] = 1;
  for (let i = 0; i < 8; ++i) {
    const r = row + dr8[i];
    const c = col + dc8[i];
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

// How to?
// 1. candidate중심 좌표만 저장하고 셀 렌더링할 때 주변 8칸에 중심좌표 있으면 후보로 표시
// 2. 2차원배열로 저장
// 3. Set으로 저장? -> Object 값 비교가 안돼서 JSON이나 toString쓰면 더 느릴듯?
// 일단 1번으로. 중심좌표와 row, col 차의 절대값이 1이하이면 표시.
// closed 에 왼쪽 down하면 커서 표시
// closed, 숫자에 양쪽 down하면 커서 + 후보 표시
// Todo: 플래그랑 곂치는거 어떻게할지. (안곂치게 처리 or closed에는 후보 표시 X)
//   -> 일단 closed에는 후보 표시 X
function onCellMouseDown(e, row, col, board, cellStates, setCursor) {
  if (e.buttons === 3) {
    if (/*cellStates[row][col] === 0 || */(cellStates[row][col] === 1 && board[row][col] > 0)) {
      setCursor({cell: [row, col], showCandidates: true});
    }
  }
  else if (e.buttons === 1) {
    if (cellStates[row][col] === 0) {
      setCursor({cell: [row, col], showCandidates: false});
    }
  }
}

function onCellMouseLeave(e, row, col, cursor, setCursor) {
  if (cursor.cell !== null && cursor.cell[0] === row && cursor.cell[1] === col) {
    setCursor({cell: null, showCandidates: false});
  }
}

function onCellMouseEnter(e, row, col, board, cellStates, setCursor) {
  if (e.buttons === 3) {
    if (/*cellStates[row][col] === 0 || */(cellStates[row][col] === 1 && board[row][col] > 0)) {
      setCursor({cell: [row, col], showCandidates: true});
    }
  }
  else if (e.buttons === 1) {
    if (cellStates[row][col] === 0) {
      setCursor({cell: [row, col], showCandidates: false});
    }
  }
}

function onCellMouseUp(e, row, col, cursor, setCursor) {
  if (cursor.cell !== null && cursor.cell[0] === row && cursor.cell[1] === col) {
    setCursor({cell: null, showCandidates: false});
  }
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

  const [cursor, setCursor] = useState({cell: null, showCandidates: false});

  const rows = [];
  for (let i = 0; i < props.rowCount; ++i) {
    const cells = [];
    for (let j = 0; j < props.columnCount; ++j) {
      const onClick = (e) => onCellLeftClick(e, i, j, board, cellStates, setCellStates);
      const onContextMenu = (e) => onCellRightClick(e, i, j, cellStates, setCellStates);
      const onMouseDown = (e) => onCellMouseDown(e, i, j, board, cellStates, setCursor);
      const onMouseEnter = (e) => onCellMouseEnter(e, i, j, board, cellStates, setCursor);
      const onMouseLeave = (e) => onCellMouseLeave(e, i, j, cursor, setCursor);
      const onMouseUp = (e) => onCellMouseUp(e, i, j, cursor, setCursor);
      const hint = (cursor.cell !== null) &&
                   ((cursor.cell[0] === i && cursor.cell[1] === j) || 
                   (cursor.showCandidates && Math.abs(cursor.cell[0] - i) <= 1 && Math.abs(cursor.cell[1] - j) <= 1));
      cells.push(<Cell key={j} 
                       state={cellStates[i][j]} 
                       value={board[i][j]} 
                       onClick={onClick} 
                       onContextMenu={onContextMenu} 
                       onMouseDown={onMouseDown}
                       onMouseEnter={onMouseEnter}
                       onMouseLeave={onMouseLeave}
                       onMouseUp={onMouseUp}
                       hint={hint} />);
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