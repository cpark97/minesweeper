import { StrictMode } from 'react'
import { render } from 'react-dom'
import { HelloWorld } from './HelloWorld'

render(
  <StrictMode>
    <HelloWorld />
  </StrictMode>,
  document.getElementById('root'),
);