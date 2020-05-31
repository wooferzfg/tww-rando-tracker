import _ from 'lodash';

import Constants from './constants';
import Permalink from './permalink';

import FLAGS from '../data/flags';

export default class Settings {
  static initializeFromPermalink(permalinkString) {
    this.options = Permalink.decode(permalinkString);

    this.flags = [];
    this.startingGear = this.getOptionValue(Permalink.OPTIONS.STARTING_GEAR);
    this.version = this.getOptionValue(Permalink.OPTIONS.VERSION);

    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_DUNGEONS)) {
      this.flags.push(this.FLAGS.DUNGEON);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_GREAT_FAIRIES)) {
      this.flags.push(this.FLAGS.GREAT_FAIRY);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_PUZZLE_SECRET_CAVES)) {
      this.flags.push(this.FLAGS.PUZZLE_SECRET_CAVE);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_COMBAT_SECRET_CAVES)) {
      this.flags.push(this.FLAGS.COMBAT_SECRET_CAVE);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_SHORT_SIDEQUESTS)) {
      this.flags.push(this.FLAGS.SHORT_SIDEQUEST);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_LONG_SIDEQUESTS)) {
      this.flags.push(this.FLAGS.LONG_SIDEQUEST);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_SPOILS_TRADING)) {
      this.flags.push(this.FLAGS.SPOILS_TRADING);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_MINIGAMES)) {
      this.flags.push(this.FLAGS.MINIGAME);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_FREE_GIFTS)) {
      this.flags.push(this.FLAGS.FREE_GIFT);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_MAIL)) {
      this.flags.push(this.FLAGS.MAIL);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_PLATFORMS_RAFTS)) {
      this.flags.push(this.FLAGS.PLATFORM);
      this.flags.push(this.FLAGS.RAFT);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_SUBMARINES)) {
      this.flags.push(this.FLAGS.SUBMARINE);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_EYE_REEF_CHESTS)) {
      this.flags.push(this.FLAGS.EYE_REEF_CHEST);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_BIG_OCTOS_GUNBOATS)) {
      this.flags.push(this.FLAGS.BIG_OCTO);
      this.flags.push(this.FLAGS.GUNBOAT);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_TREASURE_CHARTS)) {
      this.flags.push(this.FLAGS.SUNKEN_TREASURE);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_EXPENSIVE_PURCHASES)) {
      this.flags.push(this.FLAGS.EXPENSIVE_PURCHASE);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_MISC)) {
      this.flags.push(this.FLAGS.OTHER_CHEST);
      this.flags.push(this.FLAGS.MISC);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_TINGLE_CHESTS)) {
      this.flags.push(this.FLAGS.TINGLE_CHEST);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_BATTLESQUID)) {
      this.flags.push(this.FLAGS.BATTLESQUID);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_SAVAGE_LABYRINTH)) {
      this.flags.push(this.FLAGS.SAVAGE_LABYRINTH);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_ISLAND_PUZZLES)) {
      this.flags.push(this.FLAGS.ISLAND_PUZZLE);
    }
    if (this.getOptionValue(Permalink.OPTIONS.PROGRESSION_TRIFORCE_CHARTS)) {
      if (this.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS)) {
        this.flags.push(this.FLAGS.SUNKEN_TREASURE);
      } else {
        this.flags.push(this.FLAGS.SUNKEN_TRIFORCE);
      }
    }
  }

  static initializeManually(settings) {
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

  static isFlagActive(flag) {
    return _.includes(this.flags, flag);
  }

  static getOptionValue(optionName) {
    return _.get(this.options, optionName);
  }

  static getStartingGear() {
    return this.startingGear;
  }

  static getVersion() {
    return this.version;
  }
}
