import _ from 'lodash';

export default class Locations {
  static initialize(itemLocationsFile) {
    this.locations = {};

    _.forEach(itemLocationsFile, (locationData, locationName) => {
      const {
        generalLocation,
        detailedLocation
      } = this._splitLocationName(locationName);

      const filteredLocationData = _.pick(locationData, ['Need', 'Original item', 'Types']);

      _.forEach(filteredLocationData, (infoValue, infoKey) => {
        this.setLocation(generalLocation, detailedLocation, _.camelCase(infoKey), infoValue);
      });
    });
  }

  static mapLocations(locationIteratee) {
    const newLocations = {};

    _.forEach(this.locations, (generalLocationData, generalLocationName) => {
      _.forEach(_.keys(generalLocationData), (detailedLocationName) => {
        _.set(
          newLocations,
          [generalLocationName, detailedLocationName],
          locationIteratee(generalLocationName, detailedLocationName)
        );
      });
    });

    return newLocations;
  }

  static detailedLocationsForGeneralLocation(generalLocation) {
    return _.keys(_.get(this.locations, generalLocation));
  }

  static getLocation(generalLocation, detailedLocation) {
    return _.get(this.locations, [generalLocation, detailedLocation]);
  }

  static setLocation(generalLocation, detailedLocation, infoKey, infoValue) {
    _.set(this.locations, [generalLocation, detailedLocation, infoKey], infoValue);
  }

  static _splitLocationName(fullLocationName) {
    const locationMatch = fullLocationName.match(/([^-]+) - (.+)/);

    if (!locationMatch) {
      throw Error(`Location name: "${fullLocationName}" could not be parsed!`);
    }

    return {
      generalLocation: locationMatch[1],
      detailedLocation: locationMatch[2]
    };
  }
}
