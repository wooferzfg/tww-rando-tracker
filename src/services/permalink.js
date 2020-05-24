import _ from 'lodash';

export default class Permalink {
  static get OPTIONS() {
    const options = [
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

  static _base64ToBinary(base64String) {
    const buffer = Buffer.from(base64String, 'base64');
    return Array.from(buffer.values());
  }

  static _binaryToBase64(binaryArray) {
    return Buffer.from(binaryArray).toString('base64');
  }

  static _binaryToString(binaryArray) {
    return Buffer.from(binaryArray).toString();
  }
}
