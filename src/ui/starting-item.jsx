import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';

import KeyDownWrapper from './key-down-wrapper';

class StartingItem extends React.PureComponent {
  StartingItem() {
    const {
      clearSelectedItem,
      decrementStartingItem,
      images,
      incrementStartingItem,
      itemCount,
      itemName,
      setSelectedItem,
    } = this.props;

    const itemImage = _.get(images, itemCount);
    const maxItemCount = LogicHelper.maxItemCount(itemName);

    let itemClassName = '';
    if (maxItemCount === 0) {
      itemClassName = 'impossible-item';
    } else if (
      LogicHelper.isLockedStartingItem(itemName)
    ) {
      itemClassName = 'static-item';
    }

    const incrementItemFunc = (event) => {
      event.stopPropagation();

      if (!LogicHelper.isLockedStartingItem(itemName)) {
        incrementStartingItem(itemName);
      }
    };

    const decrementItemFunc = (event) => {
      event.preventDefault();

      if (!LogicHelper.isLockedStartingItem(itemName)) {
        decrementStartingItem(itemName);
      }
    };

    const setSelectedItemFunc = () => setSelectedItem(itemName);

    return (
      <div
        className={`item-container ${itemClassName}`}
        onBlur={clearSelectedItem}
        onClick={incrementItemFunc}
        onContextMenu={decrementItemFunc}
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
    return this.StartingItem();
  }
}

StartingItem.propTypes = {
  clearSelectedItem: PropTypes.func.isRequired,
  decrementStartingItem: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  incrementStartingItem: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  itemName: PropTypes.string.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
};

export default StartingItem;
