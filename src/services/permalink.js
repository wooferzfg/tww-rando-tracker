import _ from 'lodash';

import BinaryString from './binary-string';

export default class Permalink {
  static get OPTIONS() {
    const options = [
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

      'randomized_gear',
      'starting_gear',
      'starting_pohs',
      'starting_hcs',
      'remove_music',
      'randomize_enemies'
    ];

    return _.reduce(
      options,
      (accumulator, option) => _.set(accumulator, _.toUpper(option), option),
      {}
    );
  }

  static get _CONFIG() {
    return [
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
      this._booleanConfig(this.OPTIONS.KEYLUNACY)
    ];
  }

  static _stringConfig(optionName) {
    return {
      decode: (binaryString, options) => {
        const stringValue = binaryString.popString();
        _.set(options, optionName, stringValue);
      },
      encode: (binaryString, options) => {
        const stringValue = _.get(options, optionName);
        binaryString.addString(stringValue);
      }
    };
  }

  static _booleanConfig(optionName) {
    return {
      decode: (binaryString, options) => {
        const booleanValue = binaryString.popBoolean();
        _.set(options, optionName, booleanValue);
      },
      encode: (binaryString, options) => {
        const booleanValue = _.get(options, optionName);
        binaryString.addBoolean(booleanValue);
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
}
