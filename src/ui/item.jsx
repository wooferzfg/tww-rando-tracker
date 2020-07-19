import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

const Item = ({
  clearSelectedItem,
  images,
  incrementItem,
  itemName,
  setSelectedItem,
  trackerState,
}) => {
  const itemCount = trackerState.getItemValue(itemName);
  const itemImage = _.get(images, itemCount);
  const startingItemCount = LogicHelper.startingItemCount(itemName);
  const maxItemCount = LogicHelper.maxItemCount(itemName);

  let itemClassName = '';
  if (maxItemCount === 0) {
    itemClassName = 'impossible-item';
  } else if (startingItemCount === maxItemCount) {
    itemClassName = 'static-item';
  }

  const incrementItemFunc = () => incrementItem(itemName);
  const setSelectedItemFunc = () => setSelectedItem(itemName);

  return (
    <div
      className={`item-container ${itemClassName}`}
      onBlur={clearSelectedItem}
      onClick={incrementItemFunc}
      onFocus={setSelectedItemFunc}
      onKeyDown={incrementItemFunc}
      onMouseOver={setSelectedItemFunc}
      onMouseOut={clearSelectedItem}
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
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  incrementItem: PropTypes.func.isRequired,
  itemName: PropTypes.string.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default Item;
