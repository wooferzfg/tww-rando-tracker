import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Images from './images';

class ItemsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: null,
    };
  }

  setSelectedItemFunc(itemName) {
    return () => {
      this.setState({ selectedItem: itemName });
    };
  }

  clearSelectedItemFunc() {
    return () => {
      this.setState({ selectedItem: null });
    };
  }

  incrementItemFunc(itemName) {
    const {
      trackerState,
      updateTrackerState,
    } = this.props;

    return () => {
      const newTrackerState = trackerState.incrementItem(itemName);

      updateTrackerState(newTrackerState);
    };
  }

  item(itemName) {
    const { trackerState } = this.props;

    const itemCount = trackerState.getItemValue(itemName);
    const itemImage = _.get(Images.IMAGES, ['ITEMS', itemName, itemCount]);

    const clearSelectedItemFunc = this.clearSelectedItemFunc();
    const incrementItemFunc = this.incrementItemFunc(itemName);
    const setSelectedItemFunc = this.setSelectedItemFunc(itemName);

    return (
      <div
        className="item-container"
        onBlur={clearSelectedItemFunc}
        onClick={incrementItemFunc}
        onFocus={setSelectedItemFunc}
        onKeyDown={incrementItemFunc}
        onMouseOver={setSelectedItemFunc}
        onMouseOut={clearSelectedItemFunc}
        role="button"
        tabIndex="0"
      >
        <img
          alt={itemName}
          src={itemImage}
        />
      </div>
    );
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

  render() {
    return (
      <div className="item-tracker">
        <div className="menu-items">
          <table>
            <tbody>
              <tr>
                <td>
                  {this.item(LogicHelper.ITEMS.TELESCOPE)}
                </td>
              </tr>
            </tbody>
          </table>
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
