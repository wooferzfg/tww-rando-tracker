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

  static optionsTable({ title, rows }) {
    const columns = _.times(
      _.size(_.first(rows)),
      () => (
        <>
          <col className="text-col" />
          <col className="slider-col" />
        </>
      )
    );

    const optionRows = _.map(
      rows,
      (rowElements) => (
        <tr>{rowElements}</tr>
      )
    );

    return (
      <fieldset>
        <legend>{title}</legend>
        <table>
          <colgroup>
            {columns}
          </colgroup>
          <tbody>
            {optionRows}
          </tbody>
        </table>
      </fieldset>
    );
  }

  static sliderInput({ labelText }) {
    return (
      <>
        <td className="label-text">{labelText}</td>
        <td className="option-container">
          <label className="switch">
            <input type="checkbox" />
            <span className="slider" />
          </label>
        </td>
      </>
    );
  }

  static dropdownInput({ labelText, options }) {
    const dropdownOptions = _.map(
      options,
      (option) => (
        <option>{option}</option>
      )
    );

    return (
      <>
        <td className="label-text">{labelText}</td>
        <td className="option-container">
          <div className="select-container">
            <select>
              {dropdownOptions}
            </select>
          </div>
        </td>
      </>
    );
  }

  static progressItemLocationsTable() {
    return Launcher.optionsTable({
      title: 'Progress Item Locations',
      rows: [
        [
          Launcher.sliderInput({ labelText: 'Dungeons' }),
          Launcher.sliderInput({ labelText: 'Tingle Chests' }),
          Launcher.sliderInput({ labelText: 'Mail' })
        ],
        [
          Launcher.sliderInput({ labelText: 'Puzzle Secret Caves' }),
          Launcher.sliderInput({ labelText: 'Combat Secret Cave' }),
          Launcher.sliderInput({ labelText: 'Savage Labyrinth' })
        ],
        [
          Launcher.sliderInput({ labelText: 'Short Sidequests' }),
          Launcher.sliderInput({ labelText: 'Long Sidequests' }),
          Launcher.sliderInput({ labelText: 'Spoils Trading' })
        ],
        [
          Launcher.sliderInput({ labelText: 'Great Fairies' }),
          Launcher.sliderInput({ labelText: 'Free Gifts' }),
          Launcher.sliderInput({ labelText: 'Miscellaneous' })
        ],
        [
          Launcher.sliderInput({ labelText: 'Minigames' }),
          Launcher.sliderInput({ labelText: 'Battlesquid Minigame' }),
          Launcher.sliderInput({ labelText: 'Expensive Purchases' })
        ],
        [
          Launcher.sliderInput({ labelText: 'Island Puzzles' }),
          Launcher.sliderInput({ labelText: 'Lookout Platforms and Rafts' }),
          Launcher.sliderInput({ labelText: 'Submarines' })
        ],
        [
          Launcher.sliderInput({ labelText: 'Big Octos and Gunboats' }),
          Launcher.sliderInput({ labelText: 'Sunken Treasure (From Triforce Charts)' }),
          Launcher.sliderInput({ labelText: 'Sunken Treasure (From Treasure Charts)' })
        ],
        [
          Launcher.sliderInput({ labelText: 'Eye Reef Chests' })
        ]
      ]
    });
  }

  static additionalRandomizationOptionsTable() {
    return Launcher.optionsTable({
      title: 'Additional Randomization Options',
      rows: [
        [
          Launcher.dropdownInput({
            labelText: 'Sword Mode',
            options: [
              'Start with Sword',
              'Randomized Sword',
              'Swordless'
            ]
          }),
          Launcher.sliderInput({ labelText: 'Key-Lunacy' })
        ],
        [
          Launcher.dropdownInput({
            labelText: 'Triforce Shards to Start With',
            options: _.range(0, 9)
          }),
          Launcher.sliderInput({ labelText: 'Race Mode' })
        ],
        [
          Launcher.dropdownInput({
            labelText: 'Randomize Entrances',
            options: [
              'Disabled',
              'Dungeons',
              'Secret Caves',
              'Dungeons & Secret Caves (Separately)',
              'Dungeons & Secret Caves (Together)'
            ]
          }),
          Launcher.sliderInput({ labelText: 'Randomize Charts' })
        ]
      ]
    });
  }

  static convenienceTweaksTable() {
    return Launcher.optionsTable({
      title: 'Convenience Tweaks',
      rows: [
        [
          Launcher.sliderInput({ labelText: 'Skip Boss Rematches' })
        ]
      ]
    });
  }

  static launchButtonContainer() {
    return (
      <div className="launcher-button-container">
        <button className="launcher-button" type="button">Launch New Tracker</button>
        <button className="launcher-button" type="button">Load From Autosave</button>
        <button className="launcher-button" type="button">Load From File</button>
      </div>
    );
  }

  static attribution() {
    return (
      <div className="attribution">
        <span>Original Tracker by BigDunka • Maintained by wooferzfg • Source Code on </span>
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
            {Launcher.progressItemLocationsTable()}
            {Launcher.additionalRandomizationOptionsTable()}
            {Launcher.convenienceTweaksTable()}
            {Launcher.launchButtonContainer()}
          </div>
          {Launcher.attribution()}
        </div>
      </div>
    );
  }
}

export default Launcher;
