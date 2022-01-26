function preventDefault(e) {
  e.preventDefault();
}

function mouse(e) {
  console.log(e.type, e.button, e.buttons);
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
// 
// 왼쪽 -> 표시
// 오른쪽 -> 깃발
// 양쪽 -> chord
function onCellMouseDown(e, cellValue, cellState, setCursor, flagCell) {
  if (e.button === 0) {
    if (e.buttons & 2) {
      // setState 호출 횟수 최적화
      // Todo: 실제 주변에 표시될 후보지가 있는지 체크? -> 체크 비용 vs 렌더링 비용
      if (!(cellState === 1 && cellValue === 0)) {
        setCursor(true);
      }
    }
    // setState 호출 횟수 최적화
    else if (cellState === 0) {
      setCursor(false);
    }
  }
  else if (e.button === 2) {
    if (e.buttons & 1) {
      // setState 호출 횟수 최적화
      // Todo: 실제 주변에 표시될 후보지가 있는지 체크? -> 체크 비용 vs 렌더링 비용
      if (!(cellState === 1 && cellValue === 0)) {
        setCursor(true);
      }
    }
    else {
      flagCell();
    }
  }
}

// 오른쪽 안눌러진 상태에서 왼쪽 뗌 -> open
// 양쪽 모두 누르고 한쪽 뗌 -> chord
function onCellMouseUp(e, cursor, openCell, chordCell, clearCursor) {
  console.log(e.button, e.buttons);
  if (((e.buttons & 1) && e.button === 2) || ((e.buttons & 2) && e.button === 0)) {
    //chord
    chordCell();
    // 표시 해제
    clearCursor();
    console.log('chord');
  }
  else if ((e.buttons & 2) === 0 && e.button === 0) {
    if (cursor.cell !== null) {
      // open
      openCell();
      // 표시 해제
      clearCursor();
      console.log('open');
    }
  }
}

// 커서 들어왔는데 양쪽 눌러져있으면 chord, 왼쪽만 눌러져있으면 표시
function onCellMouseEnter(e, cellValue, cellState, setCursor) {
  if (e.buttons === 3) {
    // setState 호출 횟수 최적화
    // Todo: 실제 주변에 표시될 후보지가 있는지 체크? -> 체크 비용 vs 렌더링 비용
    if (!(cellState === 1 && cellValue === 0)) {
      setCursor(true);
    }
  }
  else if (e.buttons === 1) {
    // setState 호출 횟수 최적화
    if (cellState === 0) {
      setCursor(false);
    }
  }
}

// 커서 나가면 암튼 해제
function onCellMouseLeave(clearCursor) {
  clearCursor();
}

function useCellMouseEvents(cursor, setCursor, cellValue, cellState, openCell, flagCell, chordCell, clearCursor) {
  return {
    onMouseDown: (e) => onCellMouseDown(e, cellValue, cellState, setCursor, flagCell),
    onMouseUp: (e) => onCellMouseUp(e, cursor, openCell, chordCell, clearCursor),
    onMouseEnter: (e) => onCellMouseEnter(e, cellValue, cellState, setCursor),
    onMouseLeave: (e) => onCellMouseLeave(clearCursor),
  };
}

export function Cell(props) {
  const className = [
    'board__cell',
    'board__cell--close',
  ];
  if (props.state === 1) {
    className[1] = 'board__cell--open';
  }
  else if (props.state === 0 && props.hint) {
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

  const {
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
  } = useCellMouseEvents(
    props.cursor,
    props.setCursor,
    props.value,
    props.state,
    props.openCell,
    props.flagCell,
    props.chordCell,
    props.clearCursor
  );

  return (
    <td className={className.join(' ')} 
        onContextMenu={preventDefault} 
        onDragStart={preventDefault}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
      {displayValue}
    </td>
  );
}

export default Cell;