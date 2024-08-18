import _ from 'lodash';

import KEYS from '../data/keys.json';

import Locations from './locations';
import LogicHelper from './logic-helper';
import Memoizer from './memoizer';
import Permalink from './permalink';
import Settings from './settings';

class LogicCalculation {
  constructor(state) {
    this.#state = state;

    Memoizer.memoize(this, [
      'entrancesListForDungeon',
      'entrancesListForIsland',
      'estimatedLocationsLeftToCheck',
      'exitsListForEntrance',
      'formattedRequirementsForEntrance',
      'formattedRequirementsForLocation',
      'isBossDefeated',
      'isEntranceAvailable',
      'isLocationAvailable',
      'itemsNeededToFinishGame',
      'itemsRemainingForLocation',
      'itemsRemainingForRequirement',
      'locationCounts',
      'locationsList',
      'totalLocationsAvailable',
      'totalLocationsChecked',
      'totalLocationsRemaining',
    ]);

    this.#setGuaranteedKeys();
  }

  static ITEM_REQUIREMENT_COLORS = {
    AVAILABLE_ITEM: 'available-item',
    INCONSEQUENTIAL_ITEM: 'inconsequential-item',
    PLAIN_TEXT: 'plain-text',
    UNAVAILABLE_ITEM: 'unavailable-item',
  };

  static LOCATION_COLORS = {
    AVAILABLE_LOCATION: 'available-location',
    CHECKED_LOCATION: 'checked-location',
    NON_PROGRESS_LOCATION: 'non-progress-location',
    UNAVAILABLE_LOCATION: 'unavailable-location',
  };

  formattedRequirementsForLocation(generalLocation, detailedLocation) {
    const requirementsForLocation = LogicHelper.requirementsForLocation(
      generalLocation,
      detailedLocation,
      false,
    );

    return this.#formatRequirements(requirementsForLocation);
  }

  formattedRequirementsForEntrance(entranceName) {
    const requirementsForEntrance = LogicHelper.requirementsForEntrance(entranceName);

    return this.#formatRequirements(requirementsForEntrance);
  }

  locationCounts(generalLocation, { onlyProgressLocations, disableLogic }) {
    const detailedLocations = LogicHelper.filterDetailedLocations(
      generalLocation,
      { onlyProgressLocations },
    );

    let anyProgress = false;
    let numAvailable = 0;
    let numRemaining = 0;

    _.forEach(detailedLocations, (detailedLocation) => {
      if (!this.#state.isLocationChecked(generalLocation, detailedLocation)) {
        if (disableLogic || this.isLocationAvailable(generalLocation, detailedLocation)) {
          numAvailable += 1;

          if (LogicHelper.isProgressLocation(generalLocation, detailedLocation)) {
            anyProgress = true;
          }
        }
        numRemaining += 1;
      }
    });

    const color = LogicCalculation.#locationCountsColor(numAvailable, numRemaining, anyProgress);

    return {
      color,
      numAvailable,
      numRemaining,
    };
  }

  locationsList(generalLocation, { onlyProgressLocations, disableLogic }) {
    const detailedLocations = LogicHelper.filterDetailedLocations(
      generalLocation,
      { onlyProgressLocations },
    );

    return _.map(detailedLocations, (detailedLocation) => {
      const isAvailable = this.isLocationAvailable(generalLocation, detailedLocation);
      const isChecked = this.#state.isLocationChecked(generalLocation, detailedLocation);
      const isProgress = LogicHelper.isProgressLocation(generalLocation, detailedLocation);

      const color = LogicCalculation.#locationColor(
        disableLogic || isAvailable,
        isChecked,
        isProgress,
      );

      return {
        location: detailedLocation,
        color,
      };
    });
  }

  entrancesListForExit(exitName, { disableLogic }) {
    return this.#entrancesListForEntrances(
      LogicHelper.randomEntrancesForExit(exitName),
      { disableLogic },
    );
  }

  exitsListForEntrance(entranceName) {
    const exits = LogicHelper.randomExitsForEntrance(entranceName);

    const exitsWithColors = _.map(exits, (exitName) => {
      const entryName = LogicHelper.entryName(exitName);
      const isChecked = this.#state.getItemValue(entryName) > 0;
      const color = LogicCalculation.#locationColor(true, isChecked, true);

      return {
        exit: exitName,
        color,
      };
    });

    return _.concat(exitsWithColors, {
      exit: LogicHelper.NOTHING_EXIT,
      color: LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION,
    });
  }

  entrancesListForIsland(islandName, { disableLogic }) {
    return this.#entrancesListForEntrances(
      LogicHelper.entrancesForIsland(islandName),
      { disableLogic },
    );
  }

  entrancesListForDungeon(zoneName, { disableLogic }) {
    return this.#entrancesListForEntrances(
      LogicHelper.entrancesForDungeon(zoneName),
      { disableLogic },
    );
  }

  totalLocationsChecked({ onlyProgressLocations }) {
    return LogicCalculation.#countLocationsBy(
      (generalLocation, detailedLocation) => {
        const isLocationChecked = this.#state.isLocationChecked(generalLocation, detailedLocation);

        return isLocationChecked ? 1 : 0;
      },
      { onlyProgressLocations },
    );
  }

  totalLocationsAvailable({ onlyProgressLocations }) {
    return LogicCalculation.#countLocationsBy(
      (generalLocation, detailedLocation) => {
        if (this.#state.isLocationChecked(generalLocation, detailedLocation)) {
          return 0;
        }

        const isLocationAvailable = this.isLocationAvailable(
          generalLocation,
          detailedLocation,
        );

        return isLocationAvailable ? 1 : 0;
      },
      { onlyProgressLocations },
    );
  }

  totalLocationsRemaining({ onlyProgressLocations }) {
    return LogicCalculation.#countLocationsBy(
      (generalLocation, detailedLocation) => {
        const isLocationChecked = this.#state.isLocationChecked(generalLocation, detailedLocation);

        return isLocationChecked ? 0 : 1;
      },
      { onlyProgressLocations },
    );
  }

  itemsNeededToFinishGame() {
    return this.itemsRemainingForLocation(
      LogicHelper.DUNGEONS.GANONS_TOWER,
      LogicHelper.DEFEAT_GANONDORF_LOCATION,
    );
  }

  estimatedLocationsLeftToCheck() {
    const locationsRemaining = this.totalLocationsRemaining({ onlyProgressLocations: true });

    // there can't be more items remaining than locations remaining unless the tracker is used
    // incorrectly, so we apply a maximum to make sure our formula always works
    const itemsRemaining = Math.min(
      this.itemsNeededToFinishGame(),
      locationsRemaining,
    );

    // expected value for draws without replacement
    return _.round(
      (itemsRemaining * (locationsRemaining + 1)) / (itemsRemaining + 1),
    );
  }

  isBossDefeated(dungeonName) {
    const bossLocation = LogicHelper.bossLocation(dungeonName);

    return this.#state.isLocationChecked(dungeonName, bossLocation);
  }

  isLocationAvailable(generalLocation, detailedLocation) {
    if (this.#state.isLocationChecked(generalLocation, detailedLocation)) {
      return true;
    }

    const requirementsForLocation = LogicHelper.requirementsForLocation(
      generalLocation,
      detailedLocation,
      false,
    );

    return this.areRequirementsMet(requirementsForLocation);
  }

  isEntranceAvailable(entranceName) {
    const requirementsForEntrance = LogicHelper.requirementsForEntrance(entranceName);

    return this.areRequirementsMet(requirementsForEntrance);
  }

  areRequirementsMet(requirements) {
    return requirements.evaluate({
      isItemTrue: (requirement) => this.isRequirementMet(requirement),
    });
  }

  isRequirementMet(requirement) {
    const itemsRemaining = this.itemsRemainingForRequirement(requirement);
    return itemsRemaining === 0;
  }

  itemsRemainingForLocation(generalLocation, detailedLocation) {
    if (this.#state.isLocationChecked(generalLocation, detailedLocation)) {
      return 0;
    }

    const requirementsForLocation = LogicHelper.requirementsForLocation(
      generalLocation,
      detailedLocation,
      true,
    );

    return this.itemsRemainingForRequirements(requirementsForLocation);
  }

  itemsRemainingForRequirements(requirements) {
    return requirements.reduce({
      andInitialValue: 0,
      andReducer: ({
        accumulator,
        item,
        isReduced,
      }) => accumulator + (isReduced ? item : this.itemsRemainingForRequirement(item)),
      orInitialValue: Number.MAX_SAFE_INTEGER,
      orReducer: ({
        accumulator,
        item,
        isReduced,
      }) => Math.min(accumulator, (isReduced ? item : this.itemsRemainingForRequirement(item))),
    });
  }

  itemsRemainingForRequirement(requirement) {
    const remainingItemsForRequirements = [
      LogicCalculation.#impossibleRequirementRemaining(requirement),
      LogicCalculation.#nothingRequirementRemaining(requirement),
      this.#itemCountRequirementRemaining(requirement),
      this.#itemRequirementRemaining(requirement),
      this.#hasAccessedOtherLocationRequirementRemaining(requirement),
      this.#bossRequirementRemaining(requirement),
    ];

    const remainingItems = _.find(remainingItemsForRequirements, (result) => !_.isNil(result));

    if (!_.isNil(remainingItems)) {
      return remainingItems;
    }
    // istanbul ignore next
    throw Error(`Could not parse requirement: ${requirement}`);
  }

  state() {
    return this.#state;
  }

  #state;

  #entrancesListForEntrances(entrances, { disableLogic }) {
    return _.map(entrances, (entranceName) => {
      const isAvailable = this.isEntranceAvailable(entranceName);
      const isChecked = this.#state.isEntranceChecked(entranceName);

      const color = LogicCalculation.#locationColor(
        disableLogic || isAvailable,
        isChecked,
        true,
      );

      return {
        entrance: entranceName,
        color,
      };
    });
  }

  #setGuaranteedKeys() {
    this.guaranteedKeys = _.reduce(
      _.keys(KEYS),
      (accumulator, keyName) => _.set(accumulator, keyName, this.#state.getItemValue(keyName)),
      {},
    );

    if (!Settings.getOptionValue(Permalink.OPTIONS.KEYLUNACY)) {
      _.forEach(LogicHelper.MAIN_DUNGEONS, (dungeonName) => {
        const {
          guaranteedSmallKeys,
          guaranteedBigKeys,
        } = this.#guaranteedKeysForDungeon(dungeonName);

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
      });
    }

    Memoizer.invalidate([
      this.isLocationAvailable,
      this.itemsRemainingForRequirement,
    ]);
  }

  #guaranteedKeysForDungeon(dungeonName) {
    const detailedLocations = Locations.detailedLocationsForGeneralLocation(dungeonName);

    let guaranteedSmallKeys = LogicHelper.maxSmallKeysForDungeon(dungeonName);
    let guaranteedBigKeys = 1;

    _.forEach(detailedLocations, (detailedLocation) => {
      if (LogicHelper.isPotentialKeyLocation(dungeonName, detailedLocation)) {
        const smallKeysRequired = LogicHelper.smallKeysRequiredForLocation(
          dungeonName,
          detailedLocation,
        );
        const nonKeyRequirementsMet = this.#nonKeyRequirementsMetForLocation(
          dungeonName,
          detailedLocation,
          smallKeysRequired,
        );

        if (!nonKeyRequirementsMet) {
          if (smallKeysRequired < guaranteedSmallKeys) {
            guaranteedSmallKeys = smallKeysRequired;
          }
          guaranteedBigKeys = 0;
        }
      }
    });

    return {
      guaranteedSmallKeys,
      guaranteedBigKeys,
    };
  }

  #nonKeyRequirementsMetForLocation(generalLocation, detailedLocation, smallKeysRequired) {
    if (this.isLocationAvailable(generalLocation, detailedLocation)) {
      return true;
    }

    return LogicHelper.isLocationAvailableWithSmallKeys(
      generalLocation,
      detailedLocation,
      {
        numSmallKeys: smallKeysRequired,
        nonKeyRequirementMet: (requirement) => this.isRequirementMet(requirement),
      },
    );
  }

  static #impossibleRequirementRemaining(requirement) {
    if (requirement === LogicHelper.TOKENS.IMPOSSIBLE) {
      return 1;
    }

    return null;
  }

  static #nothingRequirementRemaining(requirement) {
    if (requirement === LogicHelper.TOKENS.NOTHING) {
      return 0;
    }

    return null;
  }

  #itemCountRequirementRemaining(requirement) {
    const itemCountRequirement = LogicHelper.parseItemCountRequirement(requirement);
    if (!_.isNil(itemCountRequirement)) {
      const {
        countRequired,
        itemName,
      } = itemCountRequirement;

      const itemCount = this.#currentItemValue(itemName);
      return Math.max(countRequired - itemCount, 0);
    }

    return null;
  }

  #itemRequirementRemaining(requirement) {
    const itemValue = this.#currentItemValue(requirement);
    if (!_.isNil(itemValue)) {
      if (itemValue > 0) {
        return 0;
      }
      return 1;
    }

    return null;
  }

  static #parseHasAccessedOtherLocation(requirement) {
    return _.get(requirement.match(LogicHelper.HAS_ACCESSED_OTHER_LOCATION_REGEX), 1);
  }

  #hasAccessedOtherLocationRequirementRemaining(requirement) {
    const otherLocation = LogicCalculation.#parseHasAccessedOtherLocation(requirement);
    if (otherLocation) {
      const {
        generalLocation,
        detailedLocation,
      } = Locations.splitLocationName(otherLocation);

      return this.itemsRemainingForLocation(generalLocation, detailedLocation);
    }

    return null;
  }

  #bossRequirementRemaining(requirement) {
    const bossLocation = LogicHelper.bossLocationForRequirement(requirement);
    if (!_.isNil(bossLocation)) {
      const { generalLocation, detailedLocation } = bossLocation;
      return this.itemsRemainingForLocation(generalLocation, detailedLocation);
    }
    return null;
  }

  static #BOOLEAN_EXPRESSION_TYPES = {
    AND: 'and',
    OR: 'or',
  };

  static #PLAIN_TEXT_STRINGS = {
    AND: ' and ',
    LEFT_PAREN: '(',
    OR: ' or ',
    RIGHT_PAREN: ')',
  };

  #formatRequirements(requirements) {
    const evaluatedRequirements = this.#evaluatedRequirements(requirements);
    const sortedRequirements = LogicCalculation.#sortRequirements(evaluatedRequirements);
    const readableRequirements = LogicCalculation.#createReadableRequirements(sortedRequirements);
    return readableRequirements;
  }

  #evaluatedRequirements(requirements) {
    const generateReducerFunction = (getAccumulatorValue) => ({
      accumulator,
      item,
      isReduced,
    }) => {
      if (isReduced) {
        const sortedExpression = LogicCalculation.#sortRequirements(item);

        return {
          items: _.concat(accumulator.items, sortedExpression),
          type: accumulator.type,
          value: getAccumulatorValue(accumulator.value, sortedExpression.value),
        };
      }

      const wrappedItem = {
        item,
        value: this.isRequirementMet(item),
      };

      return {
        items: _.concat(accumulator.items, wrappedItem),
        type: accumulator.type,
        value: getAccumulatorValue(accumulator.value, wrappedItem.value),
      };
    };

    return requirements.reduce({
      andInitialValue: {
        items: [],
        type: LogicCalculation.#BOOLEAN_EXPRESSION_TYPES.AND,
        value: true,
      },
      andReducer: (reducerArgs) => generateReducerFunction(
        (accumulatorValue, itemValue) => accumulatorValue && itemValue,
      )(reducerArgs),
      orInitialValue: {
        items: [],
        type: LogicCalculation.#BOOLEAN_EXPRESSION_TYPES.OR,
        value: false,
      },
      orReducer: (reducerArgs) => generateReducerFunction(
        (accumulatorValue, itemValue) => accumulatorValue || itemValue,
      )(reducerArgs),
    });
  }

  static #sortRequirements(requirements) {
    const sortedItems = _.sortBy(requirements.items, (item) => {
      if (requirements.value) {
        return item.value ? 0 : 1; // if the expression is true, we put items we have first
      }
      return item.value ? 1 : 0; // if the expression is false, we put items we're missing first
    });

    return {
      items: sortedItems,
      type: requirements.type,
      value: requirements.value,
    };
  }

  static #createReadableRequirements(requirements) {
    if (requirements.type === this.#BOOLEAN_EXPRESSION_TYPES.AND) {
      return _.map(
        requirements.items,
        (item) => _.flattenDeep(this.#createReadableRequirementsHelper(item, requirements.value)),
      );
    }
    if (requirements.type === this.#BOOLEAN_EXPRESSION_TYPES.OR) {
      return [
        _.flattenDeep(this.#createReadableRequirementsHelper(requirements, false)),
      ];
    }
    // istanbul ignore next
    throw Error(`Invalid requirements: ${JSON.stringify(requirements)}`);
  }

  static #createReadableRequirementsHelper(requirements, isInconsequential) {
    if (requirements.item) {
      const prettyItemName = LogicHelper.prettyNameForItemRequirement(requirements.item);
      const otherLocation = this.#parseHasAccessedOtherLocation(requirements.item);

      let itemColor;
      if (requirements.value) {
        itemColor = this.ITEM_REQUIREMENT_COLORS.AVAILABLE_ITEM;
      } else if (isInconsequential) {
        itemColor = this.ITEM_REQUIREMENT_COLORS.INCONSEQUENTIAL_ITEM;
      } else {
        itemColor = this.ITEM_REQUIREMENT_COLORS.UNAVAILABLE_ITEM;
      }

      return [{
        color: itemColor,
        text: otherLocation || prettyItemName,
      }];
    }

    return _.map(requirements.items, (item, index) => {
      const currentResult = [];
      const isInconsequentialForChild = isInconsequential || requirements.value;

      if (item.items) { // if the item is an expression
        currentResult.push([
          {
            color: this.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT,
            text: this.#PLAIN_TEXT_STRINGS.LEFT_PAREN,
          },
          this.#createReadableRequirementsHelper(item, isInconsequentialForChild),
          {
            color: this.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT,
            text: this.#PLAIN_TEXT_STRINGS.RIGHT_PAREN,
          },
        ]);
      } else {
        currentResult.push(this.#createReadableRequirementsHelper(item, isInconsequentialForChild));
      }

      if (index < requirements.items.length - 1) {
        if (requirements.type === this.#BOOLEAN_EXPRESSION_TYPES.AND) {
          currentResult.push({
            color: this.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT,
            text: this.#PLAIN_TEXT_STRINGS.AND,
          });
        } else if (requirements.type === this.#BOOLEAN_EXPRESSION_TYPES.OR) {
          currentResult.push({
            color: this.ITEM_REQUIREMENT_COLORS.PLAIN_TEXT,
            text: this.#PLAIN_TEXT_STRINGS.OR,
          });
        } else {
          // istanbul ignore next
          throw Error(`Invalid requirements: ${JSON.stringify(requirements)}`);
        }
      }

      return currentResult;
    });
  }

  static #locationCountsColor(numAvailable, numRemaining, anyProgress) {
    if (numRemaining === 0) {
      return this.LOCATION_COLORS.CHECKED_LOCATION;
    }
    if (numAvailable === 0) {
      return this.LOCATION_COLORS.UNAVAILABLE_LOCATION;
    }
    if (anyProgress) {
      return this.LOCATION_COLORS.AVAILABLE_LOCATION;
    }
    return this.LOCATION_COLORS.NON_PROGRESS_LOCATION;
  }

  static #locationColor(isAvailable, isChecked, isProgress) {
    if (isChecked) {
      return this.LOCATION_COLORS.CHECKED_LOCATION;
    }
    if (!isAvailable) {
      return this.LOCATION_COLORS.UNAVAILABLE_LOCATION;
    }
    if (isProgress) {
      return this.LOCATION_COLORS.AVAILABLE_LOCATION;
    }
    return this.LOCATION_COLORS.NON_PROGRESS_LOCATION;
  }

  static #countLocationsBy(iteratee, { onlyProgressLocations }) {
    return _.sumBy(Locations.allGeneralLocations(), (generalLocation) => {
      const detailedLocations = LogicHelper.filterDetailedLocations(
        generalLocation,
        { onlyProgressLocations },
      );

      return _.sumBy(detailedLocations, (detailedLocation) => {
        if (detailedLocation === LogicHelper.DEFEAT_GANONDORF_LOCATION) {
          return 0;
        }

        return iteratee(generalLocation, detailedLocation);
      });
    });
  }

  #currentItemValue(itemName) {
    const guaranteedKeyCount = _.get(this.guaranteedKeys, itemName);
    if (!_.isNil(guaranteedKeyCount)) {
      return guaranteedKeyCount;
    }

    return this.#state.getItemValue(itemName);
  }
}

export default LogicCalculation;
