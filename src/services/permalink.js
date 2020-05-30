import _ from 'lodash';

import BinaryString from './binary-string';

import PROGRESSIVE_STARTING_ITEMS from '../data/progressive-starting-items';
import REGULAR_STARTING_ITEMS from '../data/regular-starting-items';

export default class Permalink {
  static OPTIONS = _.reduce(
    [
      'seed_name',
      'version',

      'progression_dungeons',
      'progression_great_fairies',
      'progression_puzzle_secret_caves',
      'progression_combat_secret_caves',
      'progression_short_sidequests',
      'progression_long_sidequests',
      'progression_spoils_trading',
      'progression_minigames',
      'progression_free_gifts',
      'progression_mail',
      'progression_platforms_rafts',
      'progression_submarines',
      'progression_eye_reef_chests',
      'progression_big_octos_gunboats',
      'progression_triforce_charts',
      'progression_treasure_charts',
      'progression_expensive_purchases',
      'progression_misc',
      'progression_tingle_chests',
      'progression_battlesquid',
      'progression_savage_labyrinth',
      'progression_island_puzzles',

      'keylunacy',
      'randomize_entrances',
      'randomize_charts',
      'randomize_starting_island',

      'swift_sail',
      'instant_text_boxes',
      'reveal_full_sea_chart',
      'num_starting_triforce_shards',
      'add_shortcut_warps_between_dungeons',
      'do_not_generate_spoiler_log',
      'sword_mode',
      'skip_rematch_bosses',
      'invert_camera_x_axis',
      'race_mode',
      'randomize_music',
      'disable_tingle_chests_with_tingle_bombs',
      'randomize_enemy_palettes',
      'remove_title_and_ending_videos',

      'starting_gear',
      'starting_pohs',
      'starting_hcs',
      'remove_music',
      'randomize_enemies'
    ],
    (accumulator, option) => _.set(accumulator, _.toUpper(option), option),
    {}
  );

  static DROPDOWN_OPTIONS = {
    [this.OPTIONS.RANDOMIZE_ENTRANCES]: [
      'Disabled',
      'Dungeons',
      'Secret Caves',
      'Dungeons & Secret Caves (Separately)',
      'Dungeons & Secret Caves (Together)'
    ],
    [this.OPTIONS.NUM_STARTING_TRIFORCE_SHARDS]: _.range(0, 9),
    [this.OPTIONS.SWORD_MODE]: [
      'Start with Sword',
      'Randomized Sword',
      'Swordless'
    ]
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
