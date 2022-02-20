function preventDefault(e) {
  e.preventDefault();
}

function mouse(e) {
  console.log(e.type, e.button, e.buttons);
}

function Flag() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="12" width="14" height="3" fill="black"/>
      <rect x="4" y="11" width="8" height="1" fill="black"/>
      <rect x="7" y="1" width="3" height="7" fill="#FF0000"/>
      <rect x="4" y="2" width="3" height="5" fill="#FF0000"/>
      <rect x="2" y="3" width="2" height="3" fill="#FF0000"/>
      <rect x="1" y="4" width="1" height="1" fill="#FF0000"/>
      <rect x="8" y="8" width="2" height="3" fill="black"/>
    </svg>
  );
}

function Mine() {
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="64" r="47" fill="black"/>
      <rect x="58" width="12" height="18" fill="black"/>
      <rect x="58" y="110" width="12" height="18" fill="black"/>
      <rect y="55" width="18" height="12" fill="black"/>
      <rect x="110" y="55" width="18" height="12" fill="black"/>
      <rect x="17" y="17" width="12" height="12" fill="black"/>
      <rect x="99" y="17" width="12" height="12" fill="black"/>
      <rect x="99" y="99" width="12" height="12" fill="black"/>
      <rect x="17" y="99" width="12" height="12" fill="black"/>
      <circle cx="49" cy="49" r="12" fill="white"/>
    </svg>
  );
}

export function Cell(props) {
  const className = [
    'board__cell',
    'board__cell--close',
  ];
  if (props.state === 1) {
    className[1] = 'board__cell--open';
  }
  else if (props.state === 0 && props.active) {
    className[1] = 'board__cell--active';
  }

  let displayValue = null;
  if (props.state === 1) {
    if (props.value === 0) {
      displayValue = null;
    } else if (props.value === -1) {
      displayValue = <Mine />;
    } else {
      displayValue = props.value;
      className.push(`board__cell--${props.value}`);
    }
  }
  else if (props.state === 2) {
    displayValue = <Flag />;
  }

  return (
    <td className={className.join(' ')} 
        onContextMenu={preventDefault} 
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

export default Cell;