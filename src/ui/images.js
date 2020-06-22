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
      SEA_CHART: import('../images/sea_chart.png'),
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
      },
    };
  }
}
