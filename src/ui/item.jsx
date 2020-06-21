import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import TrackerState from '../services/tracker-state';

import Images from './images';

const Item = ({
  clearSelectedItem,
  incrementItem,
  itemName,
  setSelectedItem,
  trackerState,
}) => {
  const itemCount = trackerState.getItemValue(itemName);
  const itemImage = _.get(Images.IMAGES, ['ITEMS', itemName, itemCount]);

  const clearSelectedItemFunc = () => clearSelectedItem();
  const incrementItemFunc = () => incrementItem(itemName);
  const setSelectedItemFunc = () => setSelectedItem(itemName);

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
};

Item.propTypes = {
  clearSelectedItem: PropTypes.func.isRequired,
  incrementItem: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default Item;
