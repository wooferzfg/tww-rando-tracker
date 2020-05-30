import _ from 'lodash';

import DUNGEONS from '../data/dungeons';
import KEYS from '../data/keys';

import Locations from './locations';
import LogicHelper from './logic-helper';
import Memoizer from './memoizer';
import Permalink from './permalink';
import Settings from './settings';

export default class LogicCalculation {
  constructor(state) {
    this.state = state;

    Memoizer.memoize(this, [
      this.formattedRequirementsForEntrance,
      this.formattedRequirementsForLocation,
      this.isEntranceAvailable,
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

    return this._areRequirementsMet(requirementsForLocation);
  }

  isEntranceAvailable(dungeonOrCaveName) {
    const requirementsForEntrance = LogicHelper.requirementsForEntrance(dungeonOrCaveName);

    return this._areRequirementsMet(requirementsForEntrance);
  }

  formattedRequirementsForLocation(generalLocation, detailedLocation) {
    const requirementsForLocation = LogicHelper.requirementsForLocation(
      generalLocation,
      detailedLocation
    );

    return this._formatRequirements(requirementsForLocation);
  }

  formattedRequirementsForEntrance(dungeonOrCaveName) {
    const requirementsForEntrance = LogicHelper.requirementsForEntrance(dungeonOrCaveName);

    return this._formatRequirements(requirementsForEntrance);
  }

  itemsRemainingForLocation(generalLocation, detailedLocation) {
    if (this.state.isLocationChecked(generalLocation, detailedLocation)) {
      return 0;
    }

    const requirementsForLocation = LogicHelper.requirementsForLocation(
      generalLocation,
      detailedLocation
    );

    return this._itemsRemainingForRequirements(requirementsForLocation);
  }

  _areRequirementsMet(requirements) {
    return requirements.evaluate({
      isItemTrue: (requirement) => this._isRequirementMet(requirement)
    });
  }

  _itemsRemainingForRequirements(requirements) {
    return requirements.reduce({
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

    if (!Settings.getOptionValue(Permalink.OPTIONS.KEY_LUNACY)) {
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

  static _BOOLEAN_EXPRESSION_TYPES = {
    AND: 'and',
    OR: 'or'
  };

  _formatRequirements(requirements) {
    const evaluatedRequirements = this._evaluatedRequirements(requirements);
    const sortedRequirements = LogicCalculation._sortRequirements(evaluatedRequirements);
    const readableRequirements = LogicCalculation._createReadableRequirements(sortedRequirements);
    return readableRequirements;
  }

  _evaluatedRequirements(requirements) {
    const generateReducerFunction = (getAccumulatorValue) => ({
      accumulator,
      item,
      isReduced
    }) => {
      if (isReduced) {
        const sortedExpression = LogicCalculation._sortRequirements(item);

        return {
          items: _.concat(accumulator.items, sortedExpression),
          type: accumulator.type,
          value: getAccumulatorValue(accumulator.value, sortedExpression.value)
        };
      }

      const wrappedItem = {
        item,
        value: this._isRequirementMet(item)
      };

      return {
        items: _.concat(accumulator.items, wrappedItem),
        type: accumulator.type,
        value: getAccumulatorValue(accumulator.value, wrappedItem.value)
      };
    };

    return requirements.reduce({
      andInitialValue: {
        items: [],
        type: LogicCalculation._BOOLEAN_EXPRESSION_TYPES.AND,
        value: true
      },
      andReducer: (reducerArgs) => generateReducerFunction(
        (accumulatorValue, itemValue) => accumulatorValue && itemValue
      )(reducerArgs),
      orInitialValue: {
        items: [],
        type: LogicCalculation._BOOLEAN_EXPRESSION_TYPES.OR,
        value: false
      },
      orReducer: (reducerArgs) => generateReducerFunction(
        (accumulatorValue, itemValue) => accumulatorValue || itemValue
      )(reducerArgs)
    });
  }

  static _sortRequirements(requirements) {
    const sortedItems = _.sortBy(requirements.items, (item) => {
      if (requirements.value) {
        return item.value ? 0 : 1; // if the expression is true, we put items we have first
      }
      return item.value ? 1 : 0; // if the expression is false, we put items we're missing first
    });

    return {
      items: sortedItems,
      type: requirements.type,
      value: requirements.value
    };
  }

  static _createReadableRequirements(requirements) {
    if (requirements.type === this._BOOLEAN_EXPRESSION_TYPES.AND) {
      return _.map(
        requirements.items,
        (item) => _.flattenDeep(this._createReadableRequirementsHelper(item, requirements.value))
      );
    }
    if (requirements.type === this._BOOLEAN_EXPRESSION_TYPES.OR) {
      return [
        _.flattenDeep(this._createReadableRequirementsHelper(requirements, false))
      ];
    }
    throw Error(`Invalid requirements: ${JSON.stringify(requirements)}`);
  }

  static _createReadableRequirementsHelper(requirements, isInconsequential) {
    if (requirements.item) {
      const itemName = LogicHelper.prettyNameForItemRequirement(requirements.item);

      let itemColor;
      if (requirements.value) {
        itemColor = LogicHelper.ITEM_REQUIREMENT_COLORS.AVAILABLE_ITEM;
      } else if (isInconsequential) {
        itemColor = LogicHelper.ITEM_REQUIREMENT_COLORS.INCONSEQUENTIAL_ITEM;
      } else {
        itemColor = LogicHelper.ITEM_REQUIREMENT_COLORS.UNAVAILABLE_ITEM;
      }

      return [{
        color: itemColor,
        text: itemName
      }];
    }

    return _.map(requirements.items, (item, index) => {
      const currentResult = [];
      const isInconsequentialForChild = isInconsequential || requirements.value;

      if (item.items) { // if the item is an expression
        currentResult.push([
          {
            color: LogicHelper.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT,
            text: '('
          },
          this._createReadableRequirementsHelper(item, isInconsequentialForChild),
          {
            color: LogicHelper.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT,
            text: ')'
          }
        ]);
      } else {
        currentResult.push(this._createReadableRequirementsHelper(item, isInconsequentialForChild));
      }

      if (index < requirements.items.length - 1) {
        if (requirements.type === this._BOOLEAN_EXPRESSION_TYPES.AND) {
          currentResult.push({
            color: LogicHelper.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT,
            text: 'and'
          });
        } else if (requirements.type === this._BOOLEAN_EXPRESSION_TYPES.OR) {
          currentResult.push({
            color: LogicHelper.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT,
            text: 'or'
          });
        } else {
          throw Error(`Invalid requirements: ${JSON.stringify(requirements)}`);
        }
      }

      return currentResult;
    });
  }

  _currentItemValue(itemName) {
    const guaranteedKeyCount = _.get(this.guaranteedKeys, itemName);
    if (!_.isNil(guaranteedKeyCount)) {
      return guaranteedKeyCount;
    }

    return this.state.getItemValue(itemName);
  }
}
