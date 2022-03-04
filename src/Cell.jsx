function preventDefault(e) {
  e.preventDefault();
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
      <g fill="none" stroke="black" strokeWidth="10">
        <line x1="64" y1="0" x2="64" y2="128"/>
        <line x1="0" y1="64" x2="128" y2="64"/>
        <line x1="23" y1="23" x2="105" y2="105"/>
        <line x1="23" y1="105" x2="105" y2="23"/>
      </g>
      <circle cx="64" cy="64" r="45" fill="black"/>
      <circle cx="52" cy="52" r="12" fill="white"/>
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