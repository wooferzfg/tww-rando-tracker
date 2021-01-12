import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';

class Item extends React.PureComponent {
  render() {
    const {
      clearSelectedItem,
      decrementItem,
      images,
      incrementItem,
      itemCount,
      itemName,
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

      incrementItem(itemName);
    };

    const decrementItemFunc = (event) => {
      event.preventDefault();

      decrementItem(itemName);
    };

    const setSelectedItemFunc = () => setSelectedItem(itemName);

    return (
      <div
        className={`item-container ${itemClassName}`}
        onBlur={clearSelectedItem}
        onClick={incrementItemFunc}
        onContextMenu={decrementItemFunc}
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
  }
}

Item.propTypes = {
  clearSelectedItem: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  incrementItem: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  itemName: PropTypes.string.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
};

export default Item;
