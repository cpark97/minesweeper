import { useState } from 'react';

import Cell from './Cell';
import './Board.css';

// How to?
// 1. candidate중심 좌표만 저장하고 셀 렌더링할 때 주변 8칸에 중심좌표 있으면 후보로 표시
// 2. 2차원배열로 저장
// 3. Set으로 저장? -> Object 값 비교가 안돼서 JSON이나 toString쓰면 더 느릴듯?
// 일단 1번으로. 중심좌표와 row, col 차의 절대값이 1이하이면 표시.
// closed 에 왼쪽 down하면 커서 표시
// closed, 숫자에 양쪽 down하면 커서 + 후보 표시
// Todo: 플래그랑 곂치는거 어떻게할지. (안곂치게 처리 or closed에는 후보 표시 X)
//   -> 일단 closed에는 후보 표시 X
// 
// 왼쪽 -> 표시
// 오른쪽 -> 깃발
// 양쪽 -> chord
function handleCellMouseDown(e, row, col, flagCell, setHint) {
  // 양쪽 버튼 누르면 chord 힌트 표시
  if ((e.buttons & 3) === 3) {
    setHint({cell: [row, col], chord: true});
  }
  // 오른쪽 버튼 안누른 상태에서 왼쪽 버튼 누르면 힌트 표시
  else if (e.button === 0) {
    setHint({cell: [row, col], chord: false});
  }

  // 왼쪽 버튼 안누른 상태에서 오른쪽 버튼 누르면 깃발심기
  if (e.button === 2 && (e.buttons & 1) === 0) {
    flagCell(row, col);
  }
}

// 오른쪽 안눌러진 상태에서 왼쪽 뗌 -> open
// 양쪽 모두 누르고 한쪽 뗌 -> chord
function handleCellMouseUp(e, row, col, openCell, chordCell, active, setHint) {
  // 양 쪽 버튼 중 하나라도 떼면 힌트 해제
  if (e.button === 0 || e.button === 2) {
    setHint(null);
  }

  if (((e.buttons & 1) && e.button === 2) || ((e.buttons & 2) && e.button === 0)) {
    //chord
    chordCell(row, col);
  }
  else if ((e.buttons & 2) === 0 && e.button === 0) {
    if (active) {
      // open
      openCell(row, col);
    }
  }
}

// 커서 들어왔는데 양쪽 눌러져있으면 chord, 왼쪽만 눌러져있으면 표시
function handleCellMouseEnter(e, row, col, setHint) {
  if ((e.buttons & 3) === 3) {
    setHint({cell: [row, col], chord: true});
  }
  else if ((e.buttons & 1) === 1) {
    setHint({cell: [row, col], chord: false});
  }
}

// 커서 나가면 암튼 해제
function handleCellMouseLeave(setHint) {
  setHint(null);
}

function useHint(cells, cellStates) {
  const [hint, setHint] = useState(null);

  if (hint !== null) {
    const cellRow = hint.cell[0];
    const cellCol = hint.cell[1];
    const cellValue = cells[cellRow][cellCol];
    const cellState = cellStates[cellRow][cellCol];

    if (hint.chord) {
      if (!(cellState === 1 && cellValue === 0)) {
        return {
          isActive: (row, col) => (
            Math.abs(row - cellRow) <= 1 &&
            Math.abs(col - cellCol) <= 1
          ),
          setHint,
        };
      }
    }
    else {
      if (cellState === 0) {
        return {
          isActive: (row, col) => (
            row == cellRow &&
            col == cellCol
          ),
          setHint,
        };
      }
    }
  }

  return {
    isActive: () => false,
    setHint,
  };
}

export function Board(props) {
  const {cells, cellStates, openCell, flagCell, chordCell} = props;
  const {isActive, setHint} = useHint(cells, cellStates);

  const rows = [];
  for (let i = 0; i < cells.length; ++i) {
    const row = [];
    for (let j = 0; j < cells[i].length; ++j) {
      const active = isActive(i, j);
      row.push(
        <Cell key={j}
          state={cellStates[i][j]}
          value={cells[i][j]}
          active={isActive(i, j)}
          onMouseDown={(e) => handleCellMouseDown(e, i, j, flagCell, setHint)}
          onMouseUp={(e) => handleCellMouseUp(e, i, j, openCell, chordCell, active, setHint)}
          onMouseEnter={(e) => handleCellMouseEnter(e, i, j, setHint)}
          onMouseLeave={(e) => handleCellMouseLeave(setHint)}
        />
      );
    }
    rows.push(<tr key={i}>{row}</tr>);
  }
  return (
    <table className='board' onContextMenu={(e) => e.preventDefault()}>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

export default Board;