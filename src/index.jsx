import { StrictMode } from 'react';
import { render } from 'react-dom';
import MineSweeperPage from './MineSweeperPage';

render(
  <StrictMode>
    <MineSweeperPage/>
  </StrictMode>,
  document.getElementById('root'),
);