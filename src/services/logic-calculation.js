import _ from 'lodash';

import DUNGEONS from '../data/dungeons';
import KEYS from '../data/keys';

import Locations from './locations';
import LogicHelper from './logic-helper';
import Memoizer from './memoizer';
import Settings from './settings';

export default class LogicCalculation {
  constructor(state) {
    this.state = state;

    Memoizer.memoize(this, [
      this.isLocationAvailable,
      this.itemsRemainingForLocation,
      this._itemsRemainingForRequirement
    ]);

    this._setGuaranteedKeys();
  }

  isLocationAvailable(generalLocation, detailedLocation) {
    if (this.state.isLocationChecked(generalLocation, detailedLocation)) {
      return true;
    }

    const requirementsForLocation = LogicHelper.requirementsForLocation(
      generalLocation,
      detailedLocation
    );

    return requirementsForLocation.evaluate({
      isItemTrue: (requirement) => this._isRequirementMet(requirement)
    });
  }

  itemsRemainingForLocation(generalLocation, detailedLocation) {
    if (this.state.isLocationChecked(generalLocation, detailedLocation)) {
      return 0;
    }

    const requirementsForLocation = LogicHelper.requirementsForLocation(
      generalLocation,
      detailedLocation
    );

    return requirementsForLocation.reduce({
      andInitialValue: 0,
      andReducer: ({
        accumulator,
        item,
        isReduced
      }) => accumulator + (isReduced ? item : this._itemsRemainingForRequirement(item)),
      orInitialValue: 0,
      orReducer: ({
        accumulator,
        item,
        isReduced
      }) => Math.max(accumulator, (isReduced ? item : this._itemsRemainingForRequirement(item)))
    });
  }

  _setGuaranteedKeys() {
    this.guaranteedKeys = _.reduce(
      _.keys(KEYS),
      (accumulator, keyName) => _.set(accumulator, keyName, this.state.getItemValue(keyName)),
      {}
    );

    if (!Settings.getOptionValue('keyLunacy')) {
      _.forEach(DUNGEONS, (dungeonName) => {
        if (LogicHelper.isMainDungeon(dungeonName)) {
          const {
            guaranteedSmallKeys,
            guaranteedBigKeys
          } = this._guaranteedKeysForDungeon(dungeonName);

          const smallKeyName = LogicHelper.smallKeyName(dungeonName);
          const bigKeyName = LogicHelper.bigKeyName(dungeonName);

          const currentSmallKeyCount = _.get(this.guaranteedKeys, smallKeyName);
          const currentBigKeyCount = _.get(this.guaranteedKeys, bigKeyName);

          if (guaranteedSmallKeys > currentSmallKeyCount) {
            _.set(this.guaranteedKeys, smallKeyName, guaranteedSmallKeys);
          }
          if (guaranteedBigKeys > currentBigKeyCount) {
            _.set(this.guaranteedKeys, bigKeyName, guaranteedBigKeys);
          }
        }
      });
    }

    Memoizer.invalidate(this.isLocationAvailable);
    Memoizer.invalidate(this._itemsRemainingForRequirement);
  }

  _guaranteedKeysForDungeon(dungeonName) {
    const detailedLocations = Locations.detailedLocationsForGeneralLocation(dungeonName);

    let guaranteedSmallKeys = LogicHelper.maxSmallKeysForDungeon(dungeonName);
    let guaranteedBigKeys = 1;

    _.forEach(detailedLocations, (detailedLocation) => {
      if (LogicHelper.isPotentialKeyLocation(dungeonName, detailedLocation)
      && !this._nonKeyRequirementsMetForLocation(dungeonName, detailedLocation)) {
        const smallKeysRequired = LogicHelper.smallKeysRequiredForLocation(
          dungeonName,
          detailedLocation
        );

        if (smallKeysRequired < guaranteedSmallKeys) {
          guaranteedSmallKeys = smallKeysRequired;
        }
        guaranteedBigKeys = 0;
      }
    });

    return {
      guaranteedSmallKeys,
      guaranteedBigKeys
    };
  }

  _nonKeyRequirementsMetForLocation(generalLocation, detailedLocation) {
    if (this.isLocationAvailable(generalLocation, detailedLocation)) {
      return true;
    }

    const requirementsForLocation = LogicHelper.requirementsForLocation(
      generalLocation,
      detailedLocation
    );

    const smallKeyName = LogicHelper.smallKeyName(generalLocation);

    return requirementsForLocation.evaluate({
      isItemTrue: (requirement) => {
        if (_.includes(requirement, smallKeyName)) {
          return true; // assume we have all small keys
        }

        return this._isRequirementMet(requirement);
      }
    });
  }

  _isRequirementMet(requirement) {
    const itemsRemaining = this._itemsRemainingForRequirement(requirement);
    return itemsRemaining === 0;
  }

  _itemsRemainingForRequirement(requirement) {
    const remainingItemsForRequirements = [
      LogicCalculation._impossibleRequirementRemaining(requirement),
      LogicCalculation._nothingRequirementRemaining(requirement),
      this._itemCountRequirementRemaining(requirement),
      this._itemRequirementRemaining(requirement),
      this._hasAccessedOtherLocationRequirementRemaining(requirement)
    ];

    const remainingItems = _.find(remainingItemsForRequirements, (result) => !_.isNil(result));

    if (!_.isNil(remainingItems)) {
      return remainingItems;
    }
    throw Error(`Could not parse requirement: ${requirement}`);
  }

  static _impossibleRequirementRemaining(requirement) {
    if (requirement === LogicHelper.TOKENS.IMPOSSIBLE) {
      return 1;
    }

    return null;
  }

  static _nothingRequirementRemaining(requirement) {
    if (requirement === LogicHelper.TOKENS.NOTHING) {
      return 0;
    }

    return null;
  }

  _itemCountRequirementRemaining(requirement) {
    const itemCountRequirement = LogicHelper.parseItemCountRequirement(requirement);
    if (!_.isNil(itemCountRequirement)) {
      const {
        countRequired,
        itemName
      } = itemCountRequirement;

      const itemCount = this._currentItemValue(itemName);
      return Math.max(countRequired - itemCount, 0);
    }

    return null;
  }

  _itemRequirementRemaining(requirement) {
    const itemValue = this._currentItemValue(requirement);
    if (!_.isNil(itemValue)) {
      if (itemValue > 0) {
        return 0;
      }
      return 1;
    }

    return null;
  }

  _hasAccessedOtherLocationRequirementRemaining(requirement) {
    const otherLocationMatch = requirement.match(/Has Accessed Other Location "([^"]+)"/);
    if (otherLocationMatch) {
      const {
        generalLocation,
        detailedLocation
      } = Locations.splitLocationName(otherLocationMatch[1]);

      return this.itemsRemainingForLocation(generalLocation, detailedLocation);
    }

    return null;
  }

  _currentItemValue(itemName) {
    const guaranteedKeyCount = _.get(this.guaranteedKeys, itemName);
    if (!_.isNil(guaranteedKeyCount)) {
      return guaranteedKeyCount;
    }

    return this.state.getItemValue(itemName);
  }
}
