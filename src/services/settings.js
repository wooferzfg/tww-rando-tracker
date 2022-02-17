import _ from 'lodash';

import FLAGS from '../data/flags.json';

import Constants from './constants';
import Permalink from './permalink';

class Settings {
  static initializeFromPermalink(permalinkString) {
    this.options = Permalink.decode(permalinkString);

    this.flags = [];
    this.startingGear = this.getOptionValue(Permalink.OPTIONS.STARTING_GEAR);
    this.version = this._parseVersion(
      this.getOptionValue(Permalink.OPTIONS.VERSION),
    );

    _.forEach(this._FLAGS_MAPPING, (flagsForOption, optionName) => {
      if (this.getOptionValue(optionName)) {
        this.flags = _.concat(this.flags, flagsForOption);
      }
    });

    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS)) {
      if (this.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS)) {
        this.flags.push(this.FLAGS.SUNKEN_TREASURE);
      } else {
        this.flags.push(this.FLAGS.SUNKEN_TRIFORCE);
      }
    }
  }

  static initializeRaw(settings) {
    this.flags = settings.flags;
    this.options = settings.options;
    this.startingGear = settings.startingGear;
    this.version = settings.version;
  }

  static reset() {
    this.flags = null;
    this.options = null;
    this.startingGear = null;
    this.version = null;
  }

  static FLAGS = Constants.createFromArray(FLAGS);

  static readAll() {
    return {
      flags: this.flags,
      options: this.options,
      startingGear: this.startingGear,
      version: this.version,
    };
  }

  static isFlagActive(flag) {
    if (_.isNil(flag)) {
      // istanbul ignore next
      throw Error(`Invalid flag: ${flag}`);
    }

    return _.includes(this.flags, flag);
  }

  static getOptionValue(optionName) {
    const optionValue = _.get(this.options, optionName);

    if (_.isNil(optionName)) {
      // istanbul ignore next
      throw Error(`Invalid option: ${optionName}`);
    }

    return optionValue;
  }

  static getStartingGear() {
    return this.startingGear;
  }

  static getVersion() {
    return this.version;
  }

  static _FLAGS_MAPPING = {
    [Permalink.OPTIONS.PROGRESSION_DUNGEONS]: [this.FLAGS.DUNGEON],
    [Permalink.OPTIONS.PROGRESSION_GREAT_FAIRIES]: [this.FLAGS.GREAT_FAIRY],
    [Permalink.OPTIONS.PROGRESSION_PUZZLE_SECRET_CAVES]: [this.FLAGS.PUZZLE_SECRET_CAVE],
    [Permalink.OPTIONS.PROGRESSION_COMBAT_SECRET_CAVES]: [this.FLAGS.COMBAT_SECRET_CAVE],
    [Permalink.OPTIONS.PROGRESSION_SHORT_SIDEQUESTS]: [this.FLAGS.SHORT_SIDEQUEST],
    [Permalink.OPTIONS.PROGRESSION_LONG_SIDEQUESTS]: [this.FLAGS.LONG_SIDEQUEST],
    [Permalink.OPTIONS.PROGRESSION_SPOILS_TRADING]: [this.FLAGS.SPOILS_TRADING],
    [Permalink.OPTIONS.PROGRESSION_MINIGAMES]: [this.FLAGS.MINIGAME],
    [Permalink.OPTIONS.PROGRESSION_FREE_GIFTS]: [this.FLAGS.FREE_GIFT],
    [Permalink.OPTIONS.PROGRESSION_MAIL]: [this.FLAGS.MAIL],
    [Permalink.OPTIONS.PROGRESSION_PLATFORMS_RAFTS]: [
      this.FLAGS.PLATFORM,
      this.FLAGS.RAFT,
    ],
    [Permalink.OPTIONS.PROGRESSION_SUBMARINES]: [this.FLAGS.SUBMARINE],
    [Permalink.OPTIONS.PROGRESSION_EYE_REEF_CHESTS]: [this.FLAGS.EYE_REEF_CHEST],
    [Permalink.OPTIONS.PROGRESSION_BIG_OCTOS_GUNBOATS]: [
      this.FLAGS.BIG_OCTO,
      this.FLAGS.GUNBOAT,
    ],
    [Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS]: [this.FLAGS.SUNKEN_TREASURE],
    [Permalink.OPTIONS.PROGRESSION_EXPENSIVE_PURCHASES]: [this.FLAGS.EXPENSIVE_PURCHASE],
    [Permalink.OPTIONS.PROGRESSION_MISC]: [
      this.FLAGS.OTHER_CHEST,
      this.FLAGS.MISC,
    ],
    [Permalink.OPTIONS.PROGRESSION_TINGLE_CHESTS]: [this.FLAGS.TINGLE_CHEST],
    [Permalink.OPTIONS.PROGRESSION_BATTLESQUID]: [this.FLAGS.BATTLESQUID],
    [Permalink.OPTIONS.PROGRESSION_SAVAGE_LABYRINTH]: [this.FLAGS.SAVAGE_LABYRINTH],
    [Permalink.OPTIONS.PROGRESSION_ISLAND_PUZZLES]: [this.FLAGS.ISLAND_PUZZLE],
  };

  static _parseVersion(version) {
    const commitHashMatch = version.match(/([a-f\d]){7,}/);
    const versionMatch = version.match(/^[0-9.]+$/);

    return _.first(commitHashMatch) || _.first(versionMatch) || 'master';
  }
}

export default Settings;
