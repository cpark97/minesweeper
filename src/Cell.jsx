function preventDefault(e) {
  e.preventDefault();
}

function mouse(e) {
  console.log(e.type, e.button, e.buttons);
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