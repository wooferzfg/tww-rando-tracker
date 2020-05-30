import _ from 'lodash';

import BinaryString from './binary-string';
import Constants from './constants';

import OPTIONS from '../data/options';
import PROGRESSIVE_STARTING_ITEMS from '../data/progressive-starting-items';
import RANDOMIZE_ENTRANCES_OPTIONS from '../data/randomize-entrances-options';
import REGULAR_STARTING_ITEMS from '../data/regular-starting-items';
import SWORD_MODE_OPTIONS from '../data/sword-mode-options';

export default class Permalink {
  static OPTIONS = Constants.createFromArray(OPTIONS);

  static RANDOMIZE_ENTRANCES_OPTIONS = Constants.createFromArray(RANDOMIZE_ENTRANCES_OPTIONS);

  static SWORD_MODE_OPTIONS = Constants.createFromArray(SWORD_MODE_OPTIONS);

  static DROPDOWN_OPTIONS = {
    [this.OPTIONS.RANDOMIZE_ENTRANCES]: RANDOMIZE_ENTRANCES_OPTIONS,
    [this.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: _.range(0, 9),
    [this.OPTIONS.SWORD_MODE]: SWORD_MODE_OPTIONS
  };

  static _CONFIG = [
    this._stringConfig(this.OPTIONS.VERSION),
    this._stringConfig(this.OPTIONS.SEED_NAME),
    this._booleanConfig(this.OPTIONS.PROGRESSION_DUNGEONS),
    this._booleanConfig(this.OPTIONS.PROGRESSION_GREAT_FAIRIES),
    this._booleanConfig(this.OPTIONS.PROGRESSION_PUZZLE_SECRET_CAVES),
    this._booleanConfig(this.OPTIONS.PROGRESSION_COMBAT_SECRET_CAVES),
    this._booleanConfig(this.OPTIONS.PROGRESSION_SHORT_SIDEQUESTS),
    this._booleanConfig(this.OPTIONS.PROGRESSION_LONG_SIDEQUESTS),
    this._booleanConfig(this.OPTIONS.PROGRESSION_SPOILS_TRADING),
    this._booleanConfig(this.OPTIONS.PROGRESSION_MINIGAMES),
    this._booleanConfig(this.OPTIONS.PROGRESSION_FREE_GIFTS),
    this._booleanConfig(this.OPTIONS.PROGRESSION_MAIL),
    this._booleanConfig(this.OPTIONS.PROGRESSION_PLATFORMS_RAFTS),
    this._booleanConfig(this.OPTIONS.PROGRESSION_SUBMARINES),
    this._booleanConfig(this.OPTIONS.PROGRESSION_EYE_REEF_CHESTS),
    this._booleanConfig(this.OPTIONS.PROGRESSION_BIG_OCTOS_GUNBOATS),
    this._booleanConfig(this.OPTIONS.PROGRESSION_TRIFORCE_CHARTS),
    this._booleanConfig(this.OPTIONS.PROGRESSION_TREASURE_CHARTS),
    this._booleanConfig(this.OPTIONS.PROGRESSION_EXPENSIVE_PURCHASES),
    this._booleanConfig(this.OPTIONS.PROGRESSION_MISC),
    this._booleanConfig(this.OPTIONS.PROGRESSION_TINGLE_CHESTS),
    this._booleanConfig(this.OPTIONS.PROGRESSION_BATTLESQUID),
    this._booleanConfig(this.OPTIONS.PROGRESSION_SAVAGE_LABYRINTH),
    this._booleanConfig(this.OPTIONS.PROGRESSION_ISLAND_PUZZLES),
    this._booleanConfig(this.OPTIONS.KEYLUNACY),
    this._dropdownConfig(this.OPTIONS.RANDOMIZE_ENTRANCES),
    this._booleanConfig(this.OPTIONS.RANDOMIZE_CHARTS),
    this._booleanConfig(this.OPTIONS.RANDOMIZE_STARTING_ISLAND),
    this._booleanConfig(this.OPTIONS.SWIFT_SAIL),
    this._booleanConfig(this.OPTIONS.INSTANT_TEXT_BOXES),
    this._booleanConfig(this.OPTIONS.REVEAL_FULL_SEA_CHART),
    this._dropdownConfig(this.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS),
    this._booleanConfig(this.OPTIONS.ADD_SHORTCUT_WARPS_BETWEEN_DUNGEONS),
    this._booleanConfig(this.OPTIONS.DO_NOT_GENERATE_SPOILER_LOG),
    this._dropdownConfig(this.OPTIONS.SWORD_MODE),
    this._booleanConfig(this.OPTIONS.SKIP_REMATCH_BOSSES),
    this._booleanConfig(this.OPTIONS.RACE_MODE),
    this._booleanConfig(this.OPTIONS.RANDOMIZE_MUSIC),
    this._booleanConfig(this.OPTIONS.DISABLE_TINGLE_CHESTS_WITH_TINGLE_BOMBS),
    this._booleanConfig(this.OPTIONS.RANDOMIZE_ENEMY_PALETTES),
    this._booleanConfig(this.OPTIONS.REMOVE_TITLE_AND_ENDING_VIDEOS),
    this._startingGearConfig(),
    this._spinBoxConfig(this.OPTIONS.STARTING_POHS, 0, 44),
    this._spinBoxConfig(this.OPTIONS.STARTING_HCS, 0, 6),
    this._booleanConfig(this.OPTIONS.REMOVE_MUSIC),
    this._booleanConfig(this.OPTIONS.RANDOMIZE_ENEMIES)
  ];

  static _stringConfig(optionName) {
    if (_.isNil(optionName)) {
      throw Error('Invalid string option config');
    }

    return {
      decode: (binaryString, options) => {
        const stringValue = binaryString.popString();
        _.set(options, optionName, stringValue);
      },
      encode: (binaryString, options) => {
        const stringValue = _.get(options, optionName);

        if (_.isNil(stringValue)) {
          throw Error(`Invalid value for option: ${optionName}`);
        }

        binaryString.addString(stringValue);
      }
    };
  }

  static _booleanConfig(optionName) {
    if (_.isNil(optionName)) {
      throw Error('Invalid boolean option config');
    }

    return {
      decode: (binaryString, options) => {
        const booleanValue = binaryString.popBoolean();
        _.set(options, optionName, booleanValue);
      },
      encode: (binaryString, options) => {
        const booleanValue = _.get(options, optionName);

        if (_.isNil(booleanValue)) {
          throw Error(`Invalid value for option: ${booleanValue}`);
        }

        binaryString.addBoolean(booleanValue);
      }
    };
  }

  static _dropdownConfig(optionName) {
    if (_.isNil(optionName)) {
      throw Error('Invalid dropdown option config');
    }

    const dropdownOptions = _.get(this.DROPDOWN_OPTIONS, optionName);

    if (_.isNil(dropdownOptions)) {
      throw Error(`Invalid dropdown options for option: ${optionName}`);
    }

    return {
      decode: (binaryString, options) => {
        const dropdownIndex = binaryString.popNumber(BinaryString.BYTE_SIZE);
        const dropdownValue = _.get(dropdownOptions, dropdownIndex);

        if (_.isNil(dropdownValue)) {
          throw Error(`Invalid dropdown index: ${dropdownIndex} for option: ${optionName}`);
        }

        _.set(options, optionName, dropdownValue);
      },
      encode: (binaryString, options) => {
        const dropdownValue = _.get(options, optionName);
        const dropdownIndex = _.indexOf(dropdownOptions, dropdownValue);

        if (dropdownIndex < 0) {
          throw Error(`Invalid dropdown value: ${dropdownValue} for option: ${optionName}`);
        }

        binaryString.addNumber(dropdownIndex, BinaryString.BYTE_SIZE);
      }
    };
  }

  static _startingGearConfig() {
    const optionName = this.OPTIONS.STARTING_GEAR;

    return {
      decode: (binaryString, options) => {
        _.forEach(REGULAR_STARTING_ITEMS, (item) => {
          const itemValue = binaryString.popNumber(1);
          _.set(options, [optionName, item], itemValue);
        });

        _.forEach(PROGRESSIVE_STARTING_ITEMS, (item) => {
          const itemValue = binaryString.popNumber(2);
          _.set(options, [optionName, item], itemValue);
        });
      },
      encode: (binaryString, options) => {
        _.forEach(REGULAR_STARTING_ITEMS, (item) => {
          const itemValue = _.get(options, [optionName, item]);

          if (_.isNil(itemValue)) {
            throw Error(`Invalid value for starting item: ${item}`);
          }

          binaryString.addNumber(itemValue, 1);
        });

        _.forEach(PROGRESSIVE_STARTING_ITEMS, (item) => {
          const itemValue = _.get(options, [optionName, item]);

          if (_.isNil(itemValue)) {
            throw Error(`Invalid value for starting item: ${item}`);
          }

          binaryString.addNumber(itemValue, 2);
        });
      }
    };
  }

  static _spinBoxConfig(optionName, minValue, maxValue) {
    if (_.isNil(optionName)) {
      throw Error('Invalid spin box option config');
    }

    const numBits = (maxValue - minValue).toString(2).length;

    return {
      decode: (binaryString, options) => {
        const spinBoxValue = binaryString.popNumber(numBits);
        _.set(options, optionName, spinBoxValue);
      },
      encode: (binaryString, options) => {
        const spinBoxValue = _.get(options, optionName);

        if (_.isNil(spinBoxValue)) {
          throw Error(`Invalid value for option: ${spinBoxValue}`);
        }

        binaryString.addNumber(spinBoxValue, numBits);
      }
    };
  }

  static decode(permalinkString) {
    const binaryString = BinaryString.fromBase64(permalinkString);
    const options = {};

    _.forEach(this._CONFIG, (configItem) => {
      configItem.decode(binaryString, options);
    });

    return options;
  }

  static encode(options) {
    const binaryString = new BinaryString();

    _.forEach(this._CONFIG, (configItem) => {
      configItem.encode(binaryString, options);
    });

    return binaryString.toBase64();
  }
}
