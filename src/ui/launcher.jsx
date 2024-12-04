import _ from 'lodash';
import React from 'react';
import { Oval } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';

import HEADER_IMAGE from '../images/header.png';
import Permalink from '../services/permalink';
import TrackerController from '../services/tracker-controller';

import DropdownOptionInput from './dropdown-option-input';
import OptionsTable from './options-table';
import Storage from './storage';
import ToggleOptionInput from './toggle-option-input';

import 'react-toastify/dist/ReactToastify.css';
import 'react-toggle/style.css';

export default class Launcher extends React.PureComponent {
  static notifyAboutUpdate() {
    const { serviceWorker } = navigator;
    if (_.isNil(serviceWorker) || _.isNil(serviceWorker.controller)) {
      // Don't prompt for update when service worker gets removed
      return;
    }

    toast.warn(
      'A new version of the tracker is available! Click here to reload.',
      {
        autoClose: false,
        closeOnClick: true,
        onClick: () => window.location.reload(),
      },
    );
  }

  static openTrackerWindow(route) {
    const windowWidth = 1797;
    const windowHeight = 585;

    window.open(
      `#/tracker${route}`,
      '_blank',
      `width=${windowWidth},height=${windowHeight},titlebar=0,menubar=0,toolbar=0`,
    );
  }

  constructor() {
    super();

    this.state = { isLoading: true };

    this.initialize();

    this.launchNewTracker = this.launchNewTracker.bind(this);
    this.loadFromFile = this.loadFromFile.bind(this);
    this.loadFromSave = this.loadFromSave.bind(this);
    this.setOptionValue = this.setOptionValue.bind(this);
  }

  componentDidMount() {
    const { serviceWorker } = navigator;

    if (!_.isNil(serviceWorker) && !_.isNil(serviceWorker.controller)) {
      // Don't prompt for update when there was no service worker previously installed
      serviceWorker.addEventListener('controllerchange', Launcher.notifyAboutUpdate);
    }
  }

  componentWillUnmount() {
    const { serviceWorker } = navigator;

    if (!_.isNil(serviceWorker)) {
      serviceWorker.removeEventListener('controllerchange', Launcher.notifyAboutUpdate);
    }
  }

  getOptionValue(optionName) {
    const { options } = this.state;

    return _.get(options, optionName);
  }

  setOptionValue(optionName, newValue) {
    const { options } = this.state;

    _.set(options, optionName, newValue);

    this.updateOptions(options);
  }

  async initialize() {
    const permalink = Permalink.DEFAULT_PERMALINK;

    // Need to initialize locations first since that is required for parsing
    // excluded locations in permalink
    await TrackerController.initializeLocationsAndMacros(permalink);

    const options = Permalink.decode(permalink);

    this.setState({
      options,
      permalink,
      isLoading: false,
    });
  }

  loadPermalink(permalinkInput) {
    try {
      const options = Permalink.decode(permalinkInput);

      this.updateOptions(options);
    } catch (err) {
      toast.error('Invalid permalink!');
    }
  }

  updateOptions(options) {
    const permalink = Permalink.encode(options);

    this.setState({
      options,
      permalink,
    });
  }

  toggleInput({ labelText, optionName }) {
    const optionValue = this.getOptionValue(optionName);

    return (
      <ToggleOptionInput
        key={optionName}
        labelText={labelText}
        optionName={optionName}
        optionValue={optionValue}
        setOptionValue={this.setOptionValue}
      />
    );
  }

  dropdownInput({ labelText, optionName, isDisabled = false }) {
    const optionValue = this.getOptionValue(optionName);

    return (
      <DropdownOptionInput
        key={optionName}
        labelText={labelText}
        optionName={optionName}
        optionValue={optionValue}
        setOptionValue={this.setOptionValue}
        isDisabled={isDisabled}
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
            className="permalink"
            onChange={(event) => this.loadPermalink(event.target.value)}
            value={permalink}
          />
        </div>
      </div>
    );
  }

  progressItemLocationsTable() {
    return (
      <OptionsTable
        title="Progress Item Locations"
        numColumns={3}
        options={[
          this.toggleInput({
            labelText: 'Dungeons',
            optionName: Permalink.OPTIONS.PROGRESSION_DUNGEONS,
          }),
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
          this.toggleInput({
            labelText: 'Island Puzzles',
            optionName: Permalink.OPTIONS.PROGRESSION_ISLAND_PUZZLES,
          }),
          this.toggleInput({
            labelText: 'Dungeon Secrets',
            optionName: Permalink.OPTIONS.PROGRESSION_DUNGEON_SECRETS,
          }),
          this.toggleInput({
            labelText: 'Tingle Chests',
            optionName: Permalink.OPTIONS.PROGRESSION_TINGLE_CHESTS,
          }),
          this.toggleInput({
            labelText: 'Great Fairies',
            optionName: Permalink.OPTIONS.PROGRESSION_GREAT_FAIRIES,
          }),
          this.toggleInput({
            labelText: 'Submarines',
            optionName: Permalink.OPTIONS.PROGRESSION_SUBMARINES,
          }),
          this.toggleInput({
            labelText: 'Lookout Platforms and Rafts',
            optionName: Permalink.OPTIONS.PROGRESSION_PLATFORMS_RAFTS,
          }),
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
          this.toggleInput({
            labelText: 'Eye Reef Chests',
            optionName: Permalink.OPTIONS.PROGRESSION_EYE_REEF_CHESTS,
          }),
          this.toggleInput({
            labelText: 'Big Octos and Gunboats',
            optionName: Permalink.OPTIONS.PROGRESSION_BIG_OCTOS_GUNBOATS,
          }),
          this.toggleInput({
            labelText: 'Miscellaneous',
            optionName: Permalink.OPTIONS.PROGRESSION_MISC,
          }),
          this.toggleInput({
            labelText: 'Minigames',
            optionName: Permalink.OPTIONS.PROGRESSION_MINIGAMES,
          }),
          this.toggleInput({
            labelText: 'Battlesquid Minigame',
            optionName: Permalink.OPTIONS.PROGRESSION_BATTLESQUID,
          }),
          this.toggleInput({
            labelText: 'Free Gifts',
            optionName: Permalink.OPTIONS.PROGRESSION_FREE_GIFTS,
          }),
          this.toggleInput({
            labelText: 'Mail',
            optionName: Permalink.OPTIONS.PROGRESSION_MAIL,
          }),
          this.toggleInput({
            labelText: 'Expensive Purchases',
            optionName: Permalink.OPTIONS.PROGRESSION_EXPENSIVE_PURCHASES,
          }),
          this.toggleInput({
            labelText: 'Sunken Treasure (From Triforce Charts)',
            optionName: Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS,
          }),
          this.toggleInput({
            labelText: 'Sunken Treasure (From Treasure Charts)',
            optionName: Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS,
          }),
        ]}
      />
    );
  }

  entranceRandomizerOptionsTable() {
    return (
      <OptionsTable
        title="Entrance Randomizer Options"
        numColumns={2}
        options={[
          this.toggleInput({
            labelText: 'Dungeons',
            optionName: Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES,
          }),
          this.toggleInput({
            labelText: 'Nested Bosses',
            optionName: Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES,
          }),
          this.toggleInput({
            labelText: 'Nested Minibosses',
            optionName: Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES,
          }),
          this.toggleInput({
            labelText: 'Secret Caves',
            optionName: Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES,
          }),
          this.toggleInput({
            labelText: 'Inner Secret Caves',
            optionName: Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES,
          }),
          this.toggleInput({
            labelText: 'Fairy Fountains',
            optionName: Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES,
          }),
          this.dropdownInput({
            labelText: 'Mixing',
            optionName: Permalink.OPTIONS.MIX_ENTRANCES,
            isDisabled: (
              !this.getOptionValue(Permalink.OPTIONS.RANDOMIZE_DUNGEON_ENTRANCES)
              && !this.getOptionValue(Permalink.OPTIONS.RANDOMIZE_BOSS_ENTRANCES)
              && !this.getOptionValue(Permalink.OPTIONS.RANDOMIZE_MINIBOSS_ENTRANCES)
            ) || (
              !this.getOptionValue(Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_ENTRANCES)
              && !this.getOptionValue(Permalink.OPTIONS.RANDOMIZE_SECRET_CAVE_INNER_ENTRANCES)
              && !this.getOptionValue(Permalink.OPTIONS.RANDOMIZE_FAIRY_FOUNTAIN_ENTRANCES)
            ),
          }),
        ]}
      />
    );
  }

  additionalOptionsTable() {
    return (
      <OptionsTable
        title="Additional Options"
        numColumns={2}
        options={[
          this.dropdownInput({
            labelText: 'Sword Mode',
            optionName: Permalink.OPTIONS.SWORD_MODE,
          }),
          this.toggleInput({
            labelText: 'Key-Lunacy',
            optionName: Permalink.OPTIONS.KEYLUNACY,
          }),
          this.dropdownInput({
            labelText: 'Triforce Shards to Start With',
            optionName: Permalink.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS,
          }),
          this.toggleInput({
            labelText: 'Randomize Charts',
            optionName: Permalink.OPTIONS.RANDOMIZE_CHARTS,
          }),
          this.toggleInput({
            labelText: 'Required Bosses Mode',
            optionName: Permalink.OPTIONS.REQUIRED_BOSSES,
          }),
          this.dropdownInput({
            labelText: 'Number of Required Bosses',
            optionName: Permalink.OPTIONS.NUM_REQUIRED_BOSSES,
            isDisabled: !this.getOptionValue(Permalink.OPTIONS.REQUIRED_BOSSES),
          }),
          this.toggleInput({
            labelText: 'Skip Boss Rematches',
            optionName: Permalink.OPTIONS.SKIP_REMATCH_BOSSES,
          }),
        ]}
      />
    );
  }

  logicDifficultyTable() {
    return (
      <OptionsTable
        title="Logic Difficulty"
        numColumns={2}
        options={[
          this.dropdownInput({
            labelText: 'Obscure Tricks Required',
            optionName: Permalink.OPTIONS.LOGIC_OBSCURITY,
          }),
          this.dropdownInput({
            labelText: 'Precise Tricks Required',
            optionName: Permalink.OPTIONS.LOGIC_PRECISION,
          }),
        ]}
      />
    );
  }

  launchNewTracker() {
    const encodedPermalink = this.encodedPermalink();

    Launcher.openTrackerWindow(`/new/${encodedPermalink}`);
  }

  loadFromSave() {
    const encodedPermalink = this.encodedPermalink();

    Launcher.openTrackerWindow(`/load/${encodedPermalink}`);
  }

  encodedPermalink() {
    const { permalink } = this.state;

    return encodeURIComponent(permalink);
  }

  async loadFromFile() {
    await Storage.loadFileAndStore();

    this.loadFromSave();
  }

  launchButtonContainer() {
    return (
      <div className="launcher-button-container">
        <button
          className="launcher-button"
          type="button"
          onClick={this.launchNewTracker}
        >
          Launch New Tracker
        </button>
        <button
          className="launcher-button"
          type="button"
          onClick={this.loadFromSave}
        >
          Load From Autosave
        </button>
        <button
          className="launcher-button"
          type="button"
          onClick={this.loadFromFile}
        >
          Load From File
        </button>
      </div>
    );
  }

  render() {
    const { isLoading } = this.state;

    let content;

    if (isLoading) {
      content = (
        <div className="loading-spinner">
          <Oval color="white" secondaryColor="gray" />
        </div>
      );
    } else {
      content = (
        <div className="launcher-container">
          <div className="header">
            <img
              src={HEADER_IMAGE}
              alt="The Legend of Zelda: The Wind Waker Randomizer Tracker"
              draggable={false}
            />
          </div>
          <div className="settings">
            {this.permalinkContainer()}
            {this.progressItemLocationsTable()}
            {this.entranceRandomizerOptionsTable()}
            {this.additionalOptionsTable()}
            {this.logicDifficultyTable()}
            {this.launchButtonContainer()}
          </div>
          <div className="attribution">
            <span>Maintained by wooferzfg • Original Tracker by BigDunka • </span>
            <a href={`https://github.com/wooferzfg/tww-rando-tracker/commit/${COMMIT_HASH}`} target="_blank" rel="noreferrer">
              Version:
              {' '}
              {COMMIT_HASH}
              {' '}
              (
              {BUILD_DATE}
              )
            </a>
          </div>
        </div>
      );
    }
    return (
      <div className="full-container">
        {content}
        <ToastContainer />
      </div>
    );
  }
}
