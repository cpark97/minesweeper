import { MineSweeper } from './MineSweeper';

import './MineSweeperPage.css';

export function MineSweeperPage() {
  return (
    <div id="container">
      <MineSweeper />
      <footer>
        <p>
          <span>All emojis designed by </span>
          <a href="https://openmoji.org">OpenMoji</a>
          <span> - the open-source emoji and icon project. License: </span>
          <a href="https://creativecommons.org/licenses/by-sa/4.0/#">CC BY-SA 4.0</a>
        </p>
        <p>
          <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
            <img alt="Creative Commons License" style={{borderWidth: 0}} src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
          </a>
          <br />
          <span>This work is licensed under a </span>
          <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
            Creative Commons Attribution-ShareAlike 4.0 International License
          </a>.
        </p>
      </footer>
    </div>
  );
}

export default MineSweeperPage;