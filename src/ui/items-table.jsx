import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Item from './item';

class ItemsTable extends React.Component {
  static table(items, numColumns) {
    const itemRows = _.map(
      _.chunk(items, numColumns),
      (itemElements, rowIndex) => (
        <tr key={rowIndex}>
          {_.map(itemElements, (itemElement, itemIndex) => (
            <td key={itemIndex}>{itemElement}</td>
          ))}
        </tr>
      ),
    );

    return (
      <table>
        <tbody>
          {itemRows}
        </tbody>
      </table>
    );
  }

  constructor(props) {
    super(props);

    this.state = { selectedItem: null };

    this.setSelectedItem = this.setSelectedItem.bind(this);
    this.clearSelectedItem = this.clearSelectedItem.bind(this);
    this.incrementItem = this.incrementItem.bind(this);
  }

  setSelectedItem(itemName) {
    this.setState({ selectedItem: itemName });
  }

  clearSelectedItem() {
    this.setState({ selectedItem: null });
  }

  incrementItem(itemName) {
    const {
      trackerState,
      updateTrackerState,
    } = this.props;

    const newTrackerState = trackerState.incrementItem(itemName);

    updateTrackerState(newTrackerState);
  }

  itemInfo() {
    const { selectedItem } = this.state;
    const { trackerState } = this.props;

    let itemInfoText = '';

    if (!_.isNil(selectedItem)) {
      const itemCount = trackerState.getItemValue(selectedItem);
      itemInfoText = LogicHelper.prettyNameForItem(selectedItem, itemCount);
    }

    return (
      <span className="item-info">{itemInfoText}</span>
    );
  }

  item(itemName) {
    const { trackerState } = this.props;

    return (
      <Item
        clearSelectedItem={this.clearSelectedItem}
        incrementItem={this.incrementItem}
        itemName={itemName}
        setSelectedItem={this.setSelectedItem}
        trackerState={trackerState}
      />
    );
  }

  render() {
    return (
      <div className="item-tracker">
        <div className="menu-items">
          {ItemsTable.table(
            [
              this.item(LogicHelper.ITEMS.TELESCOPE),
              this.item(LogicHelper.ITEMS.BOATS_SAIL),
            ],
            8,
          )}
        </div>
        {this.itemInfo()}
      </div>
    );
  }
}

ItemsTable.propTypes = {
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  updateTrackerState: PropTypes.func.isRequired,
};

export default ItemsTable;
