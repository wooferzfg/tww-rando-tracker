import _ from 'lodash';

import LogicHelper from '../services/logic-helper';

export default class Images {
  static get IMAGES() {
    return this.images;
  }

  static async importImages() {
    this.images = {};

    await this.#resolveImports(this.#IMAGE_IMPORTS);
  }

  static async #resolveImports(imageImports, keys = []) {
    await Promise.all(
      _.map(
        imageImports,
        (importValue, importKey) => this.#resolveImportValue(importValue, keys, importKey),
      ),
    );
  }

  static async #resolveImportValue(value, keys, newKey) {
    const updatedKeys = _.concat(keys, newKey);

    if (_.isPlainObject(value)) {
      await this.#resolveImports(value, updatedKeys);
    } else {
      await this.#loadImage(value, updatedKeys);
    }
  }

  static async #loadImage(importPromise, imageKeys) {
    const imageImport = await importPromise;
    _.set(this.images, imageKeys, imageImport.default);
  }

  static get #IMAGE_IMPORTS() {
    return {
      BIG_KEYS: {
        0: import('../images/bosskey.png'),
        1: import('../images/bosskey_a.png'),
      },
      ISLAND_ENTRANCE: {
        0: import('../images/cave_red_x.png'),
        1: import('../images/cave_blue_circle.png'),
        2: import('../images/cave_gray_check.png'),
      },
      ISLAND_EXIT: {
        0: import('../images/cave_gray_x.png'),
        1: import('../images/cave_green_check.png'),
      },
      CHARTS: {
        [LogicHelper.CHART_TYPES.TREASURE]: {
          0: import('../images/chart.png'),
          1: import('../images/chartopen.png'),
        },
        [LogicHelper.CHART_TYPES.TRIFORCE]: {
          0: import('../images/triforcechart.png'),
          1: import('../images/triforcechartopen.png'),
        },
      },
      COMPASSES: {
        0: import('../images/compass.png'),
        1: import('../images/compass_a.png'),
      },
      DUNGEON_CHART_BACKGROUNDS: {
        [LogicHelper.DUNGEONS.DRAGON_ROOST_CAVERN]: import('../images/dungeon_mapfull0.png'),
        [LogicHelper.DUNGEONS.FORBIDDEN_WOODS]: import('../images/dungeon_mapfull1.png'),
        [LogicHelper.DUNGEONS.TOWER_OF_THE_GODS]: import('../images/dungeon_mapfull2.png'),
        [LogicHelper.DUNGEONS.FORSAKEN_FORTRESS]: import('../images/dungeon_mapfull3.png'),
        [LogicHelper.DUNGEONS.EARTH_TEMPLE]: import('../images/dungeon_mapfull4.png'),
        [LogicHelper.DUNGEONS.WIND_TEMPLE]: import('../images/dungeon_mapfull5.png'),
        [LogicHelper.DUNGEONS.GANONS_TOWER]: import('../images/dungeon_mapfull6.png'),
      },
      DUNGEON_ENTRANCE: {
        0: import('../images/dungeon_red_x.png'),
        1: import('../images/dungeon_blue_circle.png'),
        2: import('../images/dungeon_gray_check.png'),
      },
      DUNGEON_EXIT: {
        0: import('../images/dungeon_gray_x.png'),
        1: import('../images/dungeon_green_check.png'),
      },
      DUNGEON_MAPS: {
        0: import('../images/map.png'),
        1: import('../images/map_a.png'),
      },
      DUNGEONS: {
        [LogicHelper.DUNGEONS.DRAGON_ROOST_CAVERN]: {
          false: import('../images/boss0.png'),
          true: import('../images/boss0_d.png'),
        },
        [LogicHelper.DUNGEONS.FORBIDDEN_WOODS]: {
          false: import('../images/boss1.png'),
          true: import('../images/boss1_d.png'),
        },
        [LogicHelper.DUNGEONS.TOWER_OF_THE_GODS]: {
          false: import('../images/boss2.png'),
          true: import('../images/boss2_d.png'),
        },
        [LogicHelper.DUNGEONS.FORSAKEN_FORTRESS]: {
          false: import('../images/boss3.png'),
          true: import('../images/boss3_d.png'),
        },
        [LogicHelper.DUNGEONS.EARTH_TEMPLE]: {
          false: import('../images/boss4.png'),
          true: import('../images/boss4_d.png'),
        },
        [LogicHelper.DUNGEONS.WIND_TEMPLE]: {
          false: import('../images/boss5.png'),
          true: import('../images/boss5_d.png'),
        },
        [LogicHelper.DUNGEONS.GANONS_TOWER]: {
          false: import('../images/boss6.png'),
          true: import('../images/boss6_d.png'),
        },
      },
      EMPTY_BACKGROUND: import('../images/mapempty.png'),
      ISLAND_CHART_BACKGROUNDS: {
        [LogicHelper.ISLANDS.FORSAKEN_FORTRESS_SECTOR]: import('../images/mapfull0.png'),
        [LogicHelper.ISLANDS.STAR_ISLAND]: import('../images/mapfull1.png'),
        [LogicHelper.ISLANDS.NORTHERN_FAIRY_ISLAND]: import('../images/mapfull2.png'),
        [LogicHelper.ISLANDS.GALE_ISLE]: import('../images/mapfull3.png'),
        [LogicHelper.ISLANDS.CRESCENT_MOON_ISLAND]: import('../images/mapfull4.png'),
        [LogicHelper.ISLANDS.SEVEN_STAR_ISLES]: import('../images/mapfull5.png'),
        [LogicHelper.ISLANDS.OVERLOOK_ISLAND]: import('../images/mapfull6.png'),
        [LogicHelper.ISLANDS.FOUR_EYE_REEF]: import('../images/mapfull7.png'),
        [LogicHelper.ISLANDS.MOTHER_AND_CHILD_ISLES]: import('../images/mapfull8.png'),
        [LogicHelper.ISLANDS.SPECTACLE_ISLAND]: import('../images/mapfull9.png'),
        [LogicHelper.ISLANDS.WINDFALL_ISLAND]: import('../images/mapfull10.png'),
        [LogicHelper.ISLANDS.PAWPRINT_ISLE]: import('../images/mapfull11.png'),
        [LogicHelper.ISLANDS.DRAGON_ROOST_ISLAND]: import('../images/mapfull12.png'),
        [LogicHelper.ISLANDS.FLIGHT_CONTROL_PLATFORM]: import('../images/mapfull13.png'),
        [LogicHelper.ISLANDS.WESTERN_FAIRY_ISLAND]: import('../images/mapfull14.png'),
        [LogicHelper.ISLANDS.ROCK_SPIRE_ISLE]: import('../images/mapfull15.png'),
        [LogicHelper.ISLANDS.TINGLE_ISLAND]: import('../images/mapfull16.png'),
        [LogicHelper.ISLANDS.NORTHERN_TRIANGLE_ISLAND]: import('../images/mapfull17.png'),
        [LogicHelper.ISLANDS.EASTERN_FAIRY_ISLAND]: import('../images/mapfull18.png'),
        [LogicHelper.ISLANDS.FIRE_MOUNTAIN]: import('../images/mapfull19.png'),
        [LogicHelper.ISLANDS.STAR_BELT_ARCHIPELAGO]: import('../images/mapfull20.png'),
        [LogicHelper.ISLANDS.THREE_EYE_REEF]: import('../images/mapfull21.png'),
        [LogicHelper.ISLANDS.GREATFISH_ISLE]: import('../images/mapfull22.png'),
        [LogicHelper.ISLANDS.CYCLOPS_REEF]: import('../images/mapfull23.png'),
        [LogicHelper.ISLANDS.SIX_EYE_REEF]: import('../images/mapfull24.png'),
        [LogicHelper.ISLANDS.TOWER_OF_THE_GODS_SECTOR]: import('../images/mapfull25.png'),
        [LogicHelper.ISLANDS.EASTERN_TRIANGLE_ISLAND]: import('../images/mapfull26.png'),
        [LogicHelper.ISLANDS.THORNED_FAIRY_ISLAND]: import('../images/mapfull27.png'),
        [LogicHelper.ISLANDS.NEEDLE_ROCK_ISLE]: import('../images/mapfull28.png'),
        [LogicHelper.ISLANDS.ISLET_OF_STEEL]: import('../images/mapfull29.png'),
        [LogicHelper.ISLANDS.STONE_WATCHER_ISLAND]: import('../images/mapfull30.png'),
        [LogicHelper.ISLANDS.SOUTHERN_TRIANGLE_ISLAND]: import('../images/mapfull31.png'),
        [LogicHelper.ISLANDS.PRIVATE_OASIS]: import('../images/mapfull32.png'),
        [LogicHelper.ISLANDS.BOMB_ISLAND]: import('../images/mapfull33.png'),
        [LogicHelper.ISLANDS.BIRDS_PEAK_ROCK]: import('../images/mapfull34.png'),
        [LogicHelper.ISLANDS.DIAMOND_STEPPE_ISLAND]: import('../images/mapfull35.png'),
        [LogicHelper.ISLANDS.FIVE_EYE_REEF]: import('../images/mapfull36.png'),
        [LogicHelper.ISLANDS.SHARK_ISLAND]: import('../images/mapfull37.png'),
        [LogicHelper.ISLANDS.SOUTHERN_FAIRY_ISLAND]: import('../images/mapfull38.png'),
        [LogicHelper.ISLANDS.ICE_RING_ISLE]: import('../images/mapfull39.png'),
        [LogicHelper.ISLANDS.FOREST_HAVEN]: import('../images/mapfull40.png'),
        [LogicHelper.ISLANDS.CLIFF_PLATEAU_ISLES]: import('../images/mapfull41.png'),
        [LogicHelper.ISLANDS.HORSESHOE_ISLAND]: import('../images/mapfull42.png'),
        [LogicHelper.ISLANDS.OUTSET_ISLAND]: import('../images/mapfull43.png'),
        [LogicHelper.ISLANDS.HEADSTONE_ISLAND]: import('../images/mapfull44.png'),
        [LogicHelper.ISLANDS.TWO_EYE_REEF]: import('../images/mapfull45.png'),
        [LogicHelper.ISLANDS.ANGULAR_ISLES]: import('../images/mapfull46.png'),
        [LogicHelper.ISLANDS.BOATING_COURSE]: import('../images/mapfull47.png'),
        [LogicHelper.ISLANDS.FIVE_STAR_ISLES]: import('../images/mapfull48.png'),
        [LogicHelper.MISC_LOCATIONS.MAILBOX]: import('../images/mapfull49.png'),
        [LogicHelper.MISC_LOCATIONS.THE_GREAT_SEA]: import('../images/mapfull50.png'),
        [LogicHelper.MISC_LOCATIONS.HYRULE]: import('../images/mapfull51.png'),
      },
      ITEMS: {
        [LogicHelper.ITEMS.TELESCOPE]: {
          0: import('../images/item0.png'),
          1: import('../images/item0_a.png'),
        },
        [LogicHelper.ITEMS.BOATS_SAIL]: {
          0: import('../images/item1.png'),
          1: import('../images/item1_a.png'),
        },
        [LogicHelper.ITEMS.WIND_WAKER]: {
          0: import('../images/item2.png'),
          1: import('../images/item2_a.png'),
        },
        [LogicHelper.ITEMS.GRAPPLING_HOOK]: {
          0: import('../images/item3.png'),
          1: import('../images/item3_a.png'),
        },
        [LogicHelper.ITEMS.SPOILS_BAG]: {
          0: import('../images/item4.png'),
          1: import('../images/item4_a.png'),
        },
        [LogicHelper.ITEMS.BOOMERANG]: {
          0: import('../images/item5.png'),
          1: import('../images/item5_a.png'),
        },
        [LogicHelper.ITEMS.DEKU_LEAF]: {
          0: import('../images/item6.png'),
          1: import('../images/item6_a.png'),
        },
        [LogicHelper.ITEMS.PROGRESSIVE_SWORD]: {
          0: import('../images/item21.png'),
          1: import('../images/item21_a.png'),
          2: import('../images/item21_2_a.png'),
          3: import('../images/item21_3_a.png'),
          4: import('../images/item21_4_a.png'),
        },
        [LogicHelper.ITEMS.TINGLE_TUNER]: {
          0: import('../images/item7.png'),
          1: import('../images/item7_a.png'),
        },
        [LogicHelper.ITEMS.PROGRESSIVE_PICTO_BOX]: {
          0: import('../images/item8.png'),
          1: import('../images/item8_a.png'),
          2: import('../images/item8_2_a.png'),
        },
        [LogicHelper.ITEMS.IRON_BOOTS]: {
          0: import('../images/item9.png'),
          1: import('../images/item9_a.png'),
        },
        [LogicHelper.ITEMS.MAGIC_ARMOR]: {
          0: import('../images/item10.png'),
          1: import('../images/item10_a.png'),
        },
        [LogicHelper.ITEMS.BAIT_BAG]: {
          0: import('../images/item11.png'),
          1: import('../images/item11_a.png'),
        },
        [LogicHelper.ITEMS.PROGRESSIVE_BOW]: {
          0: import('../images/item12.png'),
          1: import('../images/item12_a.png'),
          2: import('../images/item12_2_a.png'),
          3: import('../images/item12_3_a.png'),
        },
        [LogicHelper.ITEMS.BOMBS]: {
          0: import('../images/item13.png'),
          1: import('../images/item13_a.png'),
        },
        [LogicHelper.ITEMS.PROGRESSIVE_SHIELD]: {
          0: import('../images/noshield.png'),
          1: import('../images/herosshield.png'),
          2: import('../images/mirrorshield.png'),
        },
        [LogicHelper.ITEMS.CABANA_DEED]: {
          0: import('../images/item24.png'),
          1: import('../images/item24_a.png'),
        },
        [LogicHelper.ITEMS.MAGGIES_LETTER]: {
          0: import('../images/item15.png'),
          1: import('../images/item15_a.png'),
        },
        [LogicHelper.ITEMS.MOBLINS_LETTER]: {
          0: import('../images/item16.png'),
          1: import('../images/item16_a.png'),
        },
        [LogicHelper.ITEMS.NOTE_TO_MOM]: {
          0: import('../images/item17.png'),
          1: import('../images/item17_a.png'),
        },
        [LogicHelper.ITEMS.DELIVERY_BAG]: {
          0: import('../images/item18.png'),
          1: import('../images/item18_a.png'),
        },
        [LogicHelper.ITEMS.HOOKSHOT]: {
          0: import('../images/item19.png'),
          1: import('../images/item19_a.png'),
        },
        [LogicHelper.ITEMS.SKULL_HAMMER]: {
          0: import('../images/item20.png'),
          1: import('../images/item20_a.png'),
        },
        [LogicHelper.ITEMS.POWER_BRACELETS]: {
          0: import('../images/item22.png'),
          1: import('../images/item22_a.png'),
        },
        [LogicHelper.ITEMS.EMPTY_BOTTLE]: {
          0: import('../images/item14.png'),
          1: import('../images/item14_a.png'),
          2: import('../images/item14_2_a.png'),
          3: import('../images/item14_3_a.png'),
          4: import('../images/item14_4_a.png'),
        },
        [LogicHelper.ITEMS.WINDS_REQUIEM]: {
          0: import('../images/song0.png'),
          1: import('../images/song0_a.png'),
        },
        [LogicHelper.ITEMS.BALLAD_OF_GALES]: {
          0: import('../images/song1.png'),
          1: import('../images/song1_a.png'),
        },
        [LogicHelper.ITEMS.COMMAND_MELODY]: {
          0: import('../images/song2.png'),
          1: import('../images/song2_a.png'),
        },
        [LogicHelper.ITEMS.EARTH_GODS_LYRIC]: {
          0: import('../images/song3.png'),
          1: import('../images/song3_a.png'),
        },
        [LogicHelper.ITEMS.WIND_GODS_ARIA]: {
          0: import('../images/song4.png'),
          1: import('../images/song4_a.png'),
        },
        [LogicHelper.ITEMS.SONG_OF_PASSING]: {
          0: import('../images/song5.png'),
          1: import('../images/song5_a.png'),
        },
        [LogicHelper.ITEMS.HEROS_CHARM]: {
          0: import('../images/item27.png'),
          1: import('../images/item27_a.png'),
        },
        [LogicHelper.ITEMS.NAYRUS_PEARL]: {
          0: import('../images/pearl0.png'),
          1: import('../images/pearl0_a.png'),
        },
        [LogicHelper.ITEMS.DINS_PEARL]: {
          0: import('../images/pearl1.png'),
          1: import('../images/pearl1_a.png'),
        },
        [LogicHelper.ITEMS.FARORES_PEARL]: {
          0: import('../images/pearl2.png'),
          1: import('../images/pearl2_a.png'),
        },
        [LogicHelper.ITEMS.TRIFORCE_SHARD]: {
          0: import('../images/triforce0.png'),
          1: import('../images/triforce1.png'),
          2: import('../images/triforce2.png'),
          3: import('../images/triforce3.png'),
          4: import('../images/triforce4.png'),
          5: import('../images/triforce5.png'),
          6: import('../images/triforce6.png'),
          7: import('../images/triforce7.png'),
          8: import('../images/triforce8.png'),
        },
        [LogicHelper.ITEMS.TINGLE_STATUE]: {
          0: import('../images/item31.png'),
          1: import('../images/item31_a.png'),
          2: import('../images/item31_2_a.png'),
          3: import('../images/item31_3_a.png'),
          4: import('../images/item31_4_a.png'),
          5: import('../images/item31_5_a.png'),
        },
        [LogicHelper.ITEMS.GHOST_SHIP_CHART]: {
          0: import('../images/item23.png'),
          1: import('../images/item23_a.png'),
        },
        [LogicHelper.ITEMS.HURRICANE_SPIN]: {
          0: import('../images/item30.png'),
          1: import('../images/item30_a.png'),
        },
        [LogicHelper.ITEMS.PROGRESSIVE_BOMB_BAG]: {
          0: import('../images/item29.png'),
          1: import('../images/item29_a.png'),
          2: import('../images/item29_2_a.png'),
        },
        [LogicHelper.ITEMS.PROGRESSIVE_QUIVER]: {
          0: import('../images/item28.png'),
          1: import('../images/item28_a.png'),
          2: import('../images/item28_2_a.png'),
        },
        [LogicHelper.ITEMS.PROGRESSIVE_WALLET]: {
          0: import('../images/item25.png'),
          1: import('../images/item25_a.png'),
          2: import('../images/item25_2_a.png'),
        },
        [LogicHelper.ITEMS.PROGRESSIVE_MAGIC_METER]: {
          0: import('../images/item26.png'),
          1: import('../images/item26_a.png'),
          2: import('../images/item26_2_a.png'),
        },
      },
      ITEMS_TABLE_BACKGROUND: import('../images/trackerbg.png'),
      MISC_LOCATIONS: {
        [LogicHelper.MISC_LOCATIONS.MAILBOX]: import('../images/mailbox.png'),
        [LogicHelper.MISC_LOCATIONS.THE_GREAT_SEA]: import('../images/greatsea.png'),
        [LogicHelper.MISC_LOCATIONS.HYRULE]: import('../images/hyrule.png'),
      },
      PEARL_HOLDER: import('../images/pearl_holder.png'),
      SEA_CHART: import('../images/sea_chart.png'),
      SMALL_KEYS: {
        0: import('../images/smallkey.png'),
        1: import('../images/smallkey_1.png'),
        2: import('../images/smallkey_2.png'),
        3: import('../images/smallkey_3.png'),
        4: import('../images/smallkey_4.png'),
      },
      SONG_NOTES: {
        DOWN: import('../images/song_down.png'),
        LEFT: import('../images/song_left.png'),
        NEUTRAL: import('../images/song_neutral.png'),
        RIGHT: import('../images/song_right.png'),
        UP: import('../images/song_up.png'),
      },
    };
  }
}
