import _ from 'lodash';

import KEYS from '../data/keys';

import Locations from './locations';
import LogicHelper from './logic-helper';
import Memoizer from './memoizer';

export default class LogicCalculation {
  constructor(state) {
    this.state = state;

    Memoizer.memoize(this, ['isLocationAvailable']);

    this._setGuaranteedKeys();
  }

  isLocationAvailable(generalLocation, detailedLocation) {
    const requirementsForLocation = LogicHelper.requirementsForLocation(
      generalLocation,
      detailedLocation
    );

    return requirementsForLocation.evaluate({
      isItemTrue: (requirement) => this._isRequirementMet(requirement)
    });
  }

  _setGuaranteedKeys() {
    this.guaranteedKeys = _.reduce(
      _.keys(KEYS),
      (accumulator, keyName) => _.set(accumulator, keyName, this.state.getItemValue(keyName)),
      {}
    );
  }

  _isRequirementMet(requirement) {
    const requirementsMet = [
      LogicCalculation._impossibleRequirementMet(requirement),
      LogicCalculation._nothingRequirementMet(requirement),
      this._itemCountRequirementMet(requirement),
      this._itemRequirementMet(requirement),
      this._hasAccessedOtherLocationRequirementMet(requirement)
    ];

    const requirementMet = _.find(requirementsMet, (result) => !_.isNil(result));

    if (!_.isNil(requirementMet)) {
      return requirementMet;
    }
    throw Error(`Could not parse requirement: ${requirement}`);
  }

  static _impossibleRequirementMet(requirement) {
    if (requirement === LogicHelper.TOKENS.IMPOSSIBLE) {
      return false;
    }

    return null;
  }

  static _nothingRequirementMet(requirement) {
    if (requirement === LogicHelper.TOKENS.NOTHING) {
      return true;
    }

    return null;
  }

  _itemCountRequirementMet(requirement) {
    const itemCountRequirement = LogicCalculation._parseItemCountRequirement(requirement);
    if (!_.isNil(itemCountRequirement)) {
      const {
        countRequired,
        itemName
      } = itemCountRequirement;

      const itemCount = this._currentItemValue(itemName);
      return itemCount >= countRequired;
    }

    return null;
  }

  _itemRequirementMet(requirement) {
    const itemValue = this._currentItemValue(requirement);
    if (!_.isNil(itemValue)) {
      return itemValue > 0;
    }

    return null;
  }

  _hasAccessedOtherLocationRequirementMet(requirement) {
    const otherLocationMatch = requirement.match(/Has Accessed Other Location "([^"]+)"/);
    if (otherLocationMatch) {
      const {
        generalLocation,
        detailedLocation
      } = Locations.splitLocationName(otherLocationMatch[1]);

      return this.state.isLocationChecked(generalLocation, detailedLocation)
        || this.isLocationAvailable(generalLocation, detailedLocation);
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

  static _parseItemCountRequirement(requirement) {
    const itemCountRequirementMatch = requirement.match(/((?:\w|\s)+) x(\d)/);

    if (itemCountRequirementMatch) {
      return {
        itemName: itemCountRequirementMatch[1],
        countRequired: _.toSafeInteger(itemCountRequirementMatch[2])
      };
    }

    return null;
  }
}
