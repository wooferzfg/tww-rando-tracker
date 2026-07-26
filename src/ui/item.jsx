import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';
import Spheres from '../services/spheres';

import ContextMenuWrapper from './context-menu-wrapper';
import FoundAtTooltip from './found-at-tooltip';
import KeyDownWrapper from './key-down-wrapper';
import MiddleClickWrapper from './middle-click-wrapper';
import Tooltip from './tooltip';

class Item extends React.PureComponent {
  item() {
    const {
      clearSelectedItem,
      decrementItem,
      images,
      incrementItem,
      trackItemLocation,
      itemCount,
      itemName,
      selectHintItem,
      setSelectedItem,
    } = this.props;

    const itemImage = _.get(images, itemCount);
    const startingItemCount = LogicHelper.startingItemCount(itemName);
    const maxItemCount = LogicHelper.maxItemCount(itemName);

    let itemClassName = '';
    if (maxItemCount === 0) {
      itemClassName = 'impossible-item';
    } else if (startingItemCount === maxItemCount) {
      itemClassName = 'static-item';
    }

    const incrementItemFunc = (event) => {
      event.stopPropagation();

      incrementItem(itemName, trackItemLocation);
    };

    const decrementItemFunc = (event) => {
      event.preventDefault();

      decrementItem(itemName);
    };

    const setSelectedItemFunc = () => setSelectedItem(itemName);

    // Only items that can be hinted get a middle click handler.
    const selectHintItemFunc = _.isNil(selectHintItem)
      ? null
      : MiddleClickWrapper.onMiddleClick(() => selectHintItem(itemName));

    return (
      <div
        className={`item-container ${itemClassName}`}
        onAuxClick={selectHintItemFunc}
        onBlur={clearSelectedItem}
        onClick={incrementItemFunc}
        onContextMenu={ContextMenuWrapper.onRightClick(decrementItemFunc)}
        onFocus={setSelectedItemFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(incrementItemFunc)}
        onMouseDown={MiddleClickWrapper.preventAutoScroll}
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
  locations: [],
  selectHintItem: null,
  spheres: null,
  trackItemLocation: true,
};

Item.propTypes = {
  clearSelectedItem: PropTypes.func.isRequired,
  decrementItem: PropTypes.func,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  incrementItem: PropTypes.func.isRequired,
  trackItemLocation: PropTypes.bool,
  itemCount: PropTypes.number.isRequired,
  itemName: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(PropTypes.exact({
    generalLocation: PropTypes.string.isRequired,
    detailedLocation: PropTypes.string.isRequired,
  })),
  selectHintItem: PropTypes.func,
  setSelectedItem: PropTypes.func.isRequired,
  spheres: PropTypes.instanceOf(Spheres),
};

export default Item;
