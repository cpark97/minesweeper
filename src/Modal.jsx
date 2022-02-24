import "./Modal.css";

function blockEvent(e) {
  e.preventDefault();
  e.stopPropagation();
}

export function Modal(props) {
  const className = ['modal'];
  if (props.show) {
    className.push('modal--show');
  }

  return (
    <div className={className.join(' ')}>
      <div className="modal__window">
        {props.children}
      </div>
    </div>
  );
}