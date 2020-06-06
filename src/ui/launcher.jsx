import _ from 'lodash';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import HEADER_IMAGE from '../images/header.png';
import Permalink from '../services/permalink';

import DropdownOptionInput from './dropdown-option-input';
import OptionsTable from './options-table';
import ToggleOptionInput from './toggle-option-input';

import 'react-toastify/dist/ReactToastify.css';
import 'react-toggle/style.css';

export default class Launcher extends React.Component {
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

    const permalink = Permalink.DEFAULT_PERMALINK;
    const options = Permalink.decode(permalink);

    this.state = {
      options,
      permalink,
    };

    this.getOptionValue = this.getOptionValue.bind(this);
    this.setOptionValue = this.setOptionValue.bind(this);
  }

  getOptionValue(optionName) {
    const { options } = this.state;

    return _.get(options, optionName);
  }

  setOptionValue(optionName, newValue) {
    const { options } = this.state;

    _.set(options, optionName, newValue);

    const permalink = Permalink.encode(options);

    this.setState({
      options,
      permalink,
    });
  }

  toggleInput({ labelText, optionName }) {
    return (
      <ToggleOptionInput
        getOptionValue={this.getOptionValue}
        key={optionName}
        labelText={labelText}
        optionName={optionName}
        setOptionValue={this.setOptionValue}
      />
    );
  }

  dropdownInput({ labelText, optionName }) {
    return (
      <DropdownOptionInput
        getOptionValue={this.getOptionValue}
        key={optionName}
        labelText={labelText}
        optionName={optionName}
        setOptionValue={this.setOptionValue}
      />
    );
  }

  permalinkContainer() {
    const { permalink } = this.state;

    return (
      <div className="permalink-container">
        <div className="permalink-label">Permalink:</div>
        <div className="permalink-input">
          <input
            placeholder="Permalink"
            id="flags"
            onChange={(event) => this.loadPermalink(event.target.value)}
            value={permalink}
          />
        </div>
      </div>
    );
  }

  loadPermalink(permalink) {
    try {
      const options = Permalink.decode(permalink);

      this.setState({
        options,
        permalink,
      });
    } catch (err) {
      toast.error('Invalid permalink!');
    }
  }

  progressItemLocationsTable() {
    return (
      <OptionsTable
        title="Progress Item Locations"
        numColumns={3}
        rows={[
          [
            this.toggleInput({
              labelText: 'Dungeons',
              optionName: Permalink.OPTIONS.PROGRESSION_DUNGEONS,
            }),
            this.toggleInput({
              labelText: 'Tingle Chests',
              optionName: Permalink.OPTIONS.PROGRESSION_TINGLE_CHESTS,
            }),
            this.toggleInput({
              labelText: 'Mail',
              optionName: Permalink.OPTIONS.PROGRESSION_MAIL,
            }),
          ],
          [
            this.toggleInput({
              labelText: 'Puzzle Secret Caves',
              optionName: Permalink.OPTIONS.PROGRESSION_PUZZLE_SECRET_CAVES,
            }),
            this.toggleInput({
              labelText: 'Combat Secret Caves',
              optionName: Permalink.OPTIONS.PROGRESSION_COMBAT_SECRET_CAVES,
            }),
            this.toggleInput({
              labelText: 'Savage Labyrinth',
              optionName: Permalink.OPTIONS.PROGRESSION_SAVAGE_LABYRINTH,
            }),
          ],
          [
            this.toggleInput({
              labelText: 'Short Sidequests',
              optionName: Permalink.OPTIONS.PROGRESSION_SHORT_SIDEQUESTS,
            }),
            this.toggleInput({
              labelText: 'Long Sidequests',
              optionName: Permalink.OPTIONS.PROGRESSION_LONG_SIDEQUESTS,
            }),
            this.toggleInput({
              labelText: 'Spoils Trading',
              optionName: Permalink.OPTIONS.PROGRESSION_SPOILS_TRADING,
            }),
          ],
          [
            this.toggleInput({
              labelText: 'Great Fairies',
              optionName: Permalink.OPTIONS.PROGRESSION_GREAT_FAIRIES,
            }),
            this.toggleInput({
              labelText: 'Free Gifts',
              optionName: Permalink.OPTIONS.PROGRESSION_FREE_GIFTS,
            }),
            this.toggleInput({
              labelText: 'Miscellaneous',
              optionName: Permalink.OPTIONS.PROGRESSION_MISC,
            }),
          ],
          [
            this.toggleInput({
              labelText: 'Minigames',
              optionName: Permalink.OPTIONS.PROGRESSION_MINIGAMES,
            }),
            this.toggleInput({
              labelText: 'Battlesquid Minigame',
              optionName: Permalink.OPTIONS.PROGRESSION_BATTLESQUID,
            }),
            this.toggleInput({
              labelText: 'Expensive Purchases',
              optionName: Permalink.OPTIONS.PROGRESSION_EXPENSIVE_PURCHASES,
            }),
          ],
          [
            this.toggleInput({
              labelText: 'Island Puzzles',
              optionName: Permalink.OPTIONS.PROGRESSION_ISLAND_PUZZLES,
            }),
            this.toggleInput({
              labelText: 'Lookout Platforms and Rafts',
              optionName: Permalink.OPTIONS.PROGRESSION_PLATFORMS_RAFTS,
            }),
            this.toggleInput({
              labelText: 'Submarines',
              optionName: Permalink.OPTIONS.PROGRESSION_SUBMARINES,
            }),
          ],
          [
            this.toggleInput({
              labelText: 'Big Octos and Gunboats',
              optionName: Permalink.OPTIONS.PROGRESSION_BIG_OCTOS_GUNBOATS,
            }),
            this.toggleInput({
              labelText: 'Sunken Treasure (From Triforce Charts)',
              optionName: Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS,
            }),
            this.toggleInput({
              labelText: 'Sunken Treasure (From Treasure Charts)',
              optionName: Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS,
            }),
          ],
          [
            this.toggleInput({
              labelText: 'Eye Reef Chests',
              optionName: Permalink.OPTIONS.PROGRESSION_EYE_REEF_CHESTS,
            }),
          ],
        ]}
      />
    );
  }

  additionalRandomizationOptionsTable() {
    return (
      <OptionsTable
        title="Additional Randomization Options"
        numColumns={2}
        rows={[
          [
            this.dropdownInput({
              labelText: 'Sword Mode',
              optionName: Permalink.OPTIONS.SWORD_MODE,
            }),
            this.toggleInput({
              labelText: 'Key-Lunacy',
              optionName: Permalink.OPTIONS.KEYLUNACY,
            }),
          ],
          [
            this.dropdownInput({
              labelText: 'Triforce Shards to Start With',
              optionName: Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS,
            }),
            this.toggleInput({
              labelText: 'Race Mode',
              optionName: Permalink.OPTIONS.RACE_MODE,
            }),
          ],
          [
            this.dropdownInput({
              labelText: 'Randomize Entrances',
              optionName: Permalink.OPTIONS.RANDOMIZE_ENTRANCES,
            }),
            this.toggleInput({
              labelText: 'Randomize Charts',
              optionName: Permalink.OPTIONS.RANDOMIZE_CHARTS,
            }),
          ],
        ]}
      />
    );
  }

  convenienceTweaksTable() {
    return (
      <OptionsTable
        title="Convenience Tweaks"
        numColumns={2}
        rows={[
          [
            this.toggleInput({
              labelText: 'Skip Boss Rematches',
              optionName: Permalink.OPTIONS.SKIP_REMATCH_BOSSES,
            }),
          ],
        ]}
      />
    );
  }

  render() {
    return (
      <div className="full-container">
        <div className="launcher-container">
          <div className="header">
            <img src={HEADER_IMAGE} alt="The Legend of Zelda: The Wind Waker Randomizer Tracker" />
          </div>
          <div className="settings">
            {this.permalinkContainer()}
            {this.progressItemLocationsTable()}
            {this.additionalRandomizationOptionsTable()}
            {this.convenienceTweaksTable()}
            {Launcher.launchButtonContainer()}
          </div>
          {Launcher.attribution()}
        </div>
        <ToastContainer />
      </div>
    );
  }
}
