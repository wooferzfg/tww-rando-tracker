import _ from 'lodash';

import Locations from './locations';

export default class LogicTweaks {
  static updateLocations() {
    this._addDefeatGanondorf();
    this._updateTingleStatueReward();
    this._applyHasAccessedLocationTweaksForLocations();
  }

  /**
   * Some locations and macros require another location in order to be completed. For these
   * locations, the requirements for the other location should be displayed as the name of that
   * location instead of the items required for that location.
   */
  static get _HAS_ACCESSED_LOCATION_TWEAKS() {
    return {
      itemLocations: {
        Mailbox: [
          'Letter from Baito',
          'Letter from Orca',
          'Letter from Aryll',
          'Letter from Tingle'
        ]
      },
      macros: [
        "Can Farm Knight's Crests"
      ]
    };
  }

  static _addDefeatGanondorf() {
    Locations.setLocation(
      "Ganon's Tower",
      'Defeat Ganondorf',
      'need',
      'Can Reach and Defeat Ganondorf'
    );
  }

  static _updateTingleStatueReward() {
    Locations.setLocation(
      'Tingle Island',
      'Ankle - Reward for All Tingle Statues',
      'need',
      'Tingle Statue x5'
    );
  }

  static _replaceCanAccessOtherLocation(requirements) {
    return requirements.replace(/Can Access Other Location/g, 'Has Accessed Other Location');
  }

  static _applyHasAccessedLocationTweaksForLocations() {
    const itemLocationTweaks = this._HAS_ACCESSED_LOCATION_TWEAKS.itemLocations;
    _.forEach(itemLocationTweaks, (generalLocationInfo, generalLocation) => {
      _.forEach(generalLocationInfo, (detailedLocation) => {
        const requirements = Locations.getLocation(generalLocation, detailedLocation).need;
        const newNeeds = this._replaceCanAccessOtherLocation(requirements);

        Locations.setLocation(
          generalLocation,
          detailedLocation,
          'need',
          newNeeds
        );
      });
    });
  }
}
