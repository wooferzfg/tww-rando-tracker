import _ from 'lodash';
import React from 'react';

import header from '../images/header';

class Launcher extends React.Component {
  static permalinkContainer() {
    return (
      <div className="permalink-container">
        <div className="permalink-label">Paste Permalink:</div>
        <div className="permalink-input">
          <input placeholder="Permalink" id="flags" />
        </div>
        <div>
          <button type="button">Apply Settings</button>
        </div>
      </div>
    );
  }

  static optionsTable({ title, optionRows }) {
    const columns = _.times(
      _.size(_.first(optionRows)),
      (
        <>
          <col className="text-col" />
          <col className="slider-col" />
        </>
      )
    );

    return (
      <fieldset>
        <legend>{title}</legend>
        <table>
          <colgroup>
            {columns}
          </colgroup>
          <tbody />
        </table>
      </fieldset>
    );
  }

  static launchButtonContainer() {
    return (
      <div className="launcher-button-container">
        <button className="launcher-button" type="button">Launch New Tracker</button>
        <button className="launcher-button" type="button">Load From Autosave</button>
        <button className="launcher-button" type="button">Load From File</button>
        <input type="file" id="load-progress" />
      </div>
    );
  }

  static attribution() {
    return (
      <div className="attribution">
        Original Tracker by BigDunka &#8226 Maintained by wooferzfg &#8226 Source Code on
        <a href="https://github.com/wooferzfg/tww-rando-tracker">GitHub</a>
      </div>
    );
  }

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
            {Launcher.permalinkContainer()}
            {
              Launcher.optionsTable({
                title: 'Progress Item Locations'
              })
            }
            {
              Launcher.optionsTable({
                title: 'Additional Randomization Options'
              })
            }
            {
              Launcher.optionsTable({
                title: 'Convenience Tweaks'
              })
            }
            {Launcher.launchButtonContainer()}
          </div>
          {Launcher.attribution()}
        </div>
      </div>
    );
  }
}

export default Launcher;
