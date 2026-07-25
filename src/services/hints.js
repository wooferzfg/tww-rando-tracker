import _ from 'lodash';

import PATH_GOAL_NAMES from '../data/path-goal-names.json';

class Hints {
  static SELECTION_TYPES = {
    GOAL: 'goal',
    ITEM: 'item',
    LOCATION: 'location',
  };

  static GOALS = _.keys(PATH_GOAL_NAMES);

  // Stands in for the item of a check that is known to hold something useful,
  // without knowing what. It is not a real item name, so it displays as is.
  static UNKNOWN_ITEM = 'Something';

  static isGoal(locationName) {
    return _.includes(this.GOALS, locationName);
  }

  static goalName(locationName) {
    return _.get(PATH_GOAL_NAMES, locationName, locationName);
  }

  static goalSelection(goal) {
    return { type: this.SELECTION_TYPES.GOAL, goal };
  }

  static itemSelection(itemName) {
    return { type: this.SELECTION_TYPES.ITEM, itemName };
  }

  static locationSelection(generalLocation, detailedLocation = null) {
    return { type: this.SELECTION_TYPES.LOCATION, generalLocation, detailedLocation };
  }

  /**
   * Applies a click made while hint mode is active.
   *
   * A hint is only completed by pairing a location with either a goal or an
   * item, in either order. Any other pair simply replaces the pending
   * selection, so the most recent click always wins.
   *
   * @param {object} pendingSelection The selection from a previous click, if any.
   * @param {object} newSelection The selection that was just clicked.
   * @returns {object} The new pending selection, plus the hint that was
   *   completed by this click, if any.
   */
  static applySelection(pendingSelection, newSelection) {
    if (_.isNil(pendingSelection)) {
      return Hints.#noHints(newSelection);
    }

    const { GOAL, LOCATION } = this.SELECTION_TYPES;

    if (pendingSelection.type === LOCATION && newSelection.type !== LOCATION) {
      return Hints.#completeHint(newSelection, pendingSelection);
    }

    if (newSelection.type === LOCATION && pendingSelection.type !== LOCATION) {
      return Hints.#completeHint(pendingSelection, newSelection);
    }

    // Every goal is also a zone, so once something is pending, a boss picture
    // means the dungeon it belongs to. This makes the whole dungeon tile a
    // valid target instead of only the area around the picture, and it allows
    // hinting a dungeon as the path to its own boss.
    if (newSelection.type === GOAL) {
      return Hints.#completeHint(pendingSelection, this.locationSelection(newSelection.goal));
    }

    return Hints.#noHints(newSelection);
  }

  static locationText(generalLocation, detailedLocation) {
    return _.isNil(detailedLocation)
      ? generalLocation
      : `${generalLocation} - ${detailedLocation}`;
  }

  static pathHintText({ zone, goal }) {
    return `${zone} → ${this.goalName(goal)}`;
  }

  static #noHints(pendingSelection) {
    return {
      itemHint: null,
      pathHint: null,
      pendingSelection,
    };
  }

  static #completeHint(subjectSelection, locationSelection) {
    const { generalLocation, detailedLocation } = locationSelection;

    if (subjectSelection.type === this.SELECTION_TYPES.GOAL) {
      return {
        itemHint: null,
        // Path hints always refer to a whole zone.
        pathHint: { zone: generalLocation, goal: subjectSelection.goal },
        pendingSelection: null,
      };
    }

    return {
      itemHint: {
        itemName: subjectSelection.itemName,
        generalLocation,
        detailedLocation,
      },
      pathHint: null,
      pendingSelection: null,
    };
  }
}

export default Hints;
