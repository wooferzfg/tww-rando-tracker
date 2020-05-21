import React from 'react';

import header from '../images/header';

class Launcher extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="full-container">
        <div className="launcher-container">
          <div className="header">
            <img src={header} alt="The Legend of Zelda: The Wind Waker Randomizer Tracker" />
          </div>
          <div className="settings">
            <div className="permalink-container">
              <div className="permalink-label">Paste Permalink:</div>
              <div className="permalink-input">
                <input placeholder="Permalink" id="flags" />
              </div>
              <div>
                <button type="button">Apply Settings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Launcher;
