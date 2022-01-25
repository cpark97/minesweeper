import { StrictMode } from 'react';
import { render } from 'react-dom';
// import { HelloWorld } from './HelloWorld';
// import Board from './Board';
import MineSweeper from './MineSweeper';

render(
  <StrictMode>
    <MineSweeper/>
  </StrictMode>,
  document.getElementById('root'),
);