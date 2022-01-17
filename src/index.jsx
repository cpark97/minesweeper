import { StrictMode } from 'react'
import { render } from 'react-dom'
// import { HelloWorld } from './HelloWorld'
import Board from './Board'

render(
  <StrictMode>
    <Board rowCount={10} columnCount={10} />
  </StrictMode>,
  document.getElementById('root'),
);