import _ from 'lodash';

import LogicHelper from '../services/logic-helper';

export default class Images {
  static get IMAGES() {
    return this.images;
  }

  static async importImages() {
    this.images = {};

    await this._resolveImports(this._IMAGE_IMPORTS);
  }

  static async _resolveImports(imageImports, keys = []) {
    await Promise.all(
      _.map(
        imageImports,
        (importValue, importKey) => this._resolveImportValue(importValue, keys, importKey),
      ),
    );
  }

  static async _resolveImportValue(value, keys, newKey) {
    const updatedKeys = _.concat(keys, newKey);

    if (_.isPlainObject(value)) {
      await this._resolveImports(value, updatedKeys);
    } else {
      await this._loadImage(value, updatedKeys);
    }
  }

  static async _loadImage(importPromise, imageKeys) {
    const imageImport = await importPromise;
    _.set(this.images, imageKeys, imageImport.default);
  }

  static get _IMAGE_IMPORTS() {
    return {
      BIG_KEYS: {
        0: import('../images/bosskey.png'),
        1: import('../images/bosskey_a.png'),
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
        [LogicHelper.ITEMS.MIRROR_SHIELD]: {
          0: import('../images/herosshield.png'),
          1: import('../images/mirrorshield.png'),
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
        [LogicHelper.ITEMS.MAGIC_METER_UPGRADE]: {
          0: import('../images/item26.png'),
          1: import('../images/item26_a.png'),
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
