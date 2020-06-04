import _ from 'lodash';
import React from 'react';
import Toggle from 'react-toggle';

import Permalink from '../services/permalink';

import Images from './images';

import 'react-toggle/style.css';

export default class Launcher extends React.Component {
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

  static optionsTable({ title, numColumns, rows }) {
    const columns = _.times(
      numColumns,
      () => (
        <>
          <col className="text-col" />
          <col className="slider-col" />
        </>
      ),
    );

    const optionRows = _.map(
      rows,
      (rowElements) => (
        <tr>{rowElements}</tr>
      ),
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

    this.state = { options: Permalink.defaultOptions() };

    this.importImages();
  }

  async importImages() {
    await Images.importImages();

    this.setState({ headerImage: Images.IMAGES.HEADER });
  }

  sliderInput({ labelText, optionName }) {
    const { options } = this.state;

    return (
      <>
        <td className="label-text">{labelText}</td>
        <td className="option-container">
          <div className="toggle-container">
            <Toggle
              checked={_.get(options, optionName)}
              icons={false}
            />
          </div>
        </td>
      </>
    );
  }

  dropdownInput({ labelText, optionName }) {
    const { options } = this.state;

    const dropdownOptions = _.map(
      _.get(Permalink.DROPDOWN_OPTIONS, optionName),
      (option) => (
        <option value={option}>{option}</option>
      ),
    );

    return (
      <>
        <td className="label-text">{labelText}</td>
        <td className="option-container">
          <div className="select-container">
            <select value={_.get(options, optionName)}>
              {dropdownOptions}
            </select>
          </div>
        </td>
      </>
    );
  }

  progressItemLocationsTable() {
    return Launcher.optionsTable({
      title: 'Progress Item Locations',
      numColumns: 3,
      rows: [
        [
          this.sliderInput({
            labelText: 'Dungeons',
            optionName: Permalink.OPTIONS.PROGRESSION_DUNGEONS,
          }),
          this.sliderInput({
            labelText: 'Tingle Chests',
            optionName: Permalink.OPTIONS.PROGRESSION_TINGLE_CHESTS,
          }),
          this.sliderInput({
            labelText: 'Mail',
            optionName: Permalink.OPTIONS.PROGRESSION_MAIL,
          }),
        ],
        [
          this.sliderInput({
            labelText: 'Puzzle Secret Caves',
            optionName: Permalink.OPTIONS.PROGRESSION_PUZZLE_SECRET_CAVES,
          }),
          this.sliderInput({
            labelText: 'Combat Secret Caves',
            optionName: Permalink.OPTIONS.PROGRESSION_COMBAT_SECRET_CAVES,
          }),
          this.sliderInput({
            labelText: 'Savage Labyrinth',
            optionName: Permalink.OPTIONS.PROGRESSION_SAVAGE_LABYRINTH,
          }),
        ],
        [
          this.sliderInput({
            labelText: 'Short Sidequests',
            optionName: Permalink.OPTIONS.PROGRESSION_SHORT_SIDEQUESTS,
          }),
          this.sliderInput({
            labelText: 'Long Sidequests',
            optionName: Permalink.OPTIONS.PROGRESSION_LONG_SIDEQUESTS,
          }),
          this.sliderInput({
            labelText: 'Spoils Trading',
            optionName: Permalink.OPTIONS.PROGRESSION_SPOILS_TRADING,
          }),
        ],
        [
          this.sliderInput({
            labelText: 'Great Fairies',
            optionName: Permalink.OPTIONS.PROGRESSION_GREAT_FAIRIES,
          }),
          this.sliderInput({
            labelText: 'Free Gifts',
            optionName: Permalink.OPTIONS.PROGRESSION_FREE_GIFTS,
          }),
          this.sliderInput({
            labelText: 'Miscellaneous',
            optionName: Permalink.OPTIONS.PROGRESSION_MISC,
          }),
        ],
        [
          this.sliderInput({
            labelText: 'Minigames',
            optionName: Permalink.OPTIONS.PROGRESSION_MINIGAMES,
          }),
          this.sliderInput({
            labelText: 'Battlesquid Minigame',
            optionName: Permalink.OPTIONS.PROGRESSION_BATTLESQUID,
          }),
          this.sliderInput({
            labelText: 'Expensive Purchases',
            optionName: Permalink.OPTIONS.PROGRESSION_EXPENSIVE_PURCHASES,
          }),
        ],
        [
          this.sliderInput({
            labelText: 'Island Puzzles',
            optionName: Permalink.OPTIONS.PROGRESSION_ISLAND_PUZZLES,
          }),
          this.sliderInput({
            labelText: 'Lookout Platforms and Rafts',
            optionName: Permalink.OPTIONS.PROGRESSION_PLATFORMS_RAFTS,
          }),
          this.sliderInput({
            labelText: 'Submarines',
            optionName: Permalink.OPTIONS.PROGRESSION_SUBMARINES,
          }),
        ],
        [
          this.sliderInput({
            labelText: 'Big Octos and Gunboats',
            optionName: Permalink.OPTIONS.PROGRESSION_BIG_OCTOS_GUNBOATS,
          }),
          this.sliderInput({
            labelText: 'Sunken Treasure (From Triforce Charts)',
            optionName: Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS,
          }),
          this.sliderInput({
            labelText: 'Sunken Treasure (From Treasure Charts)',
            optionName: Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS,
          }),
        ],
        [
          this.sliderInput({
            labelText: 'Eye Reef Chests',
            optionName: Permalink.OPTIONS.PROGRESSION_EYE_REEF_CHESTS,
          }),
        ],
      ],
    });
  }

  additionalRandomizationOptionsTable() {
    return Launcher.optionsTable({
      title: 'Additional Randomization Options',
      numColumns: 2,
      rows: [
        [
          this.dropdownInput({
            labelText: 'Sword Mode',
            optionName: Permalink.OPTIONS.SWORD_MODE,
          }),
          this.sliderInput({
            labelText: 'Key-Lunacy',
            optionName: Permalink.OPTIONS.KEY_LUNACY,
          }),
        ],
        [
          this.dropdownInput({
            labelText: 'Triforce Shards to Start With',
            optionName: Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS,
          }),
          this.sliderInput({
            labelText: 'Race Mode',
            optionName: Permalink.OPTIONS.RACE_MODE,
          }),
        ],
        [
          this.dropdownInput({
            labelText: 'Randomize Entrances',
            optionName: Permalink.OPTIONS.RANDOMIZE_ENTRANCES,
          }),
          this.sliderInput({
            labelText: 'Randomize Charts',
            optionName: Permalink.OPTIONS.RANDOMIZE_CHARTS,
          }),
        ],
      ],
    });
  }

  convenienceTweaksTable() {
    return Launcher.optionsTable({
      title: 'Convenience Tweaks',
      numColumns: 2,
      rows: [
        [
          this.sliderInput({
            labelText: 'Skip Boss Rematches',
            optionName: Permalink.OPTIONS.SKIP_BOSS_REMATCHES,
          }),
        ],
      ],
    });
  }

  render() {
    const { headerImage } = this.state;

    return (
      <div className="full-container">
        <div className="launcher-container">
          <div className="header">
            <img src={headerImage} alt="The Legend of Zelda: The Wind Waker Randomizer Tracker" />
          </div>
          <div className="settings">
            {Launcher.permalinkContainer()}
            {this.progressItemLocationsTable()}
            {this.additionalRandomizationOptionsTable()}
            {this.convenienceTweaksTable()}
            {Launcher.launchButtonContainer()}
          </div>
          {Launcher.attribution()}
        </div>
      </div>
    );
  }
}
