import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import IMPORTANT_ITEM_LOCATIONS from '../data/important-item-locations.json';
import Locations from '../services/locations';
import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';

class ItemHints extends React.PureComponent {
  itemRow(itemData) {
    const { logic } = this.props;
    const { item, generalLocation, detailedLocation } = itemData;

    const possibleLocationsForItem = this.possibleLocationsForItem(
      generalLocation,
      detailedLocation,
    );

    return (
      <tr key={`${generalLocation}-${detailedLocation}`}>
        <td className="item-name">{item}</td>
        <td className="general-location">{generalLocation}</td>
        <td className="detailed-location">{detailedLocation}</td>
        <td className="possible-locations">{possibleLocationsForItem.map(loc => `${loc.generalLocation} - ${loc.detailedLocation}`).join(', ')}</td>
      </tr>
    );
  }

  possibleLocationsForItem(itemGeneralLocation, itemDetailedLocation) {
    const { logic } = this.props;

    const itemLocationRequirements = LogicHelper.requirementsForLocation(
      itemGeneralLocation,
      itemDetailedLocation,
      true,
    );
    const matchingLocations = [];

    Locations.mapLocations((generalLocation, detailedLocation) => {
      if (!LogicHelper.isProgressLocation(generalLocation, detailedLocation)) {
        // continue
        return true;
      }

      const otherLocationRequirements = LogicHelper.requirementsForLocation(generalLocation, detailedLocation, true);
      if (itemLocationRequirements.isEqualTo({
        otherExpression: otherLocationRequirements,
        areItemsEqual: ({ item, otherItem }) => LogicHelper.requirementImplies(item, otherItem) && LogicHelper.requirementImplies(otherItem, item)
      })) {
        matchingLocations.push({
          generalLocation,
          detailedLocation,
        });
      }
    });

    return matchingLocations;
  }

  render() {
    return (
      <div className="important-items-list">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>General Location</th>
              <th>Detailed Location</th>
              <th>Possible Locations</th>
            </tr>
          </thead>
          <tbody>
            {_.map(IMPORTANT_ITEM_LOCATIONS, (itemData) => this.itemRow(itemData))}
          </tbody>
        </table>
      </div>
    );
  }
}

ItemHints.propTypes = {
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
};

export default ItemHints;