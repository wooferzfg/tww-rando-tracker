import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';
import Spheres from '../services/spheres';

import ContextMenuWrapper from './context-menu-wrapper';
import FoundAtTooltip from './found-at-tooltip';
import KeyDownWrapper from './key-down-wrapper';
import Tooltip from './tooltip';

class Item extends React.PureComponent {
  item() {
    const {
      clearSelectedItem,
      decrementItem,
      images,
      incrementItem,
      isStartingItem,
      isStartingItemMode,
      itemCount,
      itemName,
      locations,
      setSelectedItem,
      trackItemLocation,
      updateStartingItemCount,
    } = this.props;

    const displayedItemCount = isStartingItem ? Math.max(itemCount, 1) : itemCount;
    const itemImage = _.get(images, displayedItemCount);
    const startingItemCount = LogicHelper.startingItemCount(itemName);
    const maxItemCount = LogicHelper.maxItemCount(itemName);

    let itemClassName = '';
    if (maxItemCount === 0) {
      itemClassName = 'impossible-item';
    } else if (startingItemCount === maxItemCount) {
      itemClassName = 'static-item';
    }

    const incrementItemFunc = (event) => {
      if (!_.isNil(event.button) && event.button !== 0) {
        return;
      }

      event.stopPropagation();

      if (isStartingItemMode) {
        if (updateStartingItemCount) {
          updateStartingItemCount(itemName);
        }

        return;
      }

      incrementItem(itemName, trackItemLocation);
    };

    const decrementItemFunc = (event) => {
      if (!decrementItem) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      decrementItem(itemName);
    };

    const decrementStartingItemFunc = (event) => {
      if (!updateStartingItemCount) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      updateStartingItemCount(itemName, -1);
    };

    const rightClickFunc = isStartingItemMode
      ? decrementStartingItemFunc
      : decrementItemFunc;

    const onMiddleMouseDown = updateStartingItemCount
      ? ContextMenuWrapper.onMiddleClick(() => {
        updateStartingItemCount(itemName);
      })
      : undefined;

    const setSelectedItemFunc = () => setSelectedItem(itemName);

    return (
      <div
        className={`item-container ${itemClassName} ${isStartingItem ? 'starting-item' : ''}`}
        onBlur={clearSelectedItem}
        onClick={incrementItemFunc}
        onContextMenu={ContextMenuWrapper.onRightClick(rightClickFunc)}        
        onMouseDown={onMiddleMouseDown}
        onFocus={setSelectedItemFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(incrementItemFunc)}
        onMouseOver={setSelectedItemFunc}
        onMouseOut={clearSelectedItem}
        role="button"
        tabIndex="0"
      >
        <img
          alt={itemName}
          src={itemImage}
          draggable={false}
        />
      </div>
    );
  }

  render() {
    const { locations, spheres } = this.props;

    if (!_.isEmpty(locations)) {
      return (
        <Tooltip tooltipContent={<FoundAtTooltip locations={locations} spheres={spheres} />}>
          {this.item()}
        </Tooltip>
      );
    }

    return this.item();
  }
}

Item.defaultProps = {
  decrementItem: null,
  isStartingItem: false,
  locations: [],
  spheres: null,
  updateStartingItemCount: null,
  trackItemLocation: true,
};

Item.propTypes = {
  clearSelectedItem: PropTypes.func.isRequired,
  decrementItem: PropTypes.func,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  incrementItem: PropTypes.func.isRequired,
  isStartingItem: PropTypes.bool,
  isStartingItemMode: PropTypes.bool,
  itemCount: PropTypes.number.isRequired,
  itemName: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(PropTypes.exact({
    generalLocation: PropTypes.string.isRequired,
    detailedLocation: PropTypes.string.isRequired,
  })),
  setSelectedItem: PropTypes.func.isRequired,
  spheres: PropTypes.instanceOf(Spheres),
  updateStartingItemCount: PropTypes.func,
  trackItemLocation: PropTypes.bool,
};

export default Item;
