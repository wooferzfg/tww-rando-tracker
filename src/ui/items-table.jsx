import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import Item from './item';
import Table from './table';

class ItemsTable extends React.Component {
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
          <Table
            elements={[
              this.item(LogicHelper.ITEMS.TELESCOPE),
              this.item(LogicHelper.ITEMS.BOATS_SAIL),
              this.item(LogicHelper.ITEMS.WIND_WAKER),
              this.item(LogicHelper.ITEMS.GRAPPLING_HOOK),
              this.item(LogicHelper.ITEMS.SPOILS_BAG),
              this.item(LogicHelper.ITEMS.BOOMERANG),
              this.item(LogicHelper.ITEMS.DEKU_LEAF),
              this.item(LogicHelper.ITEMS.PROGRESSIVE_SWORD),

              this.item(LogicHelper.ITEMS.TINGLE_TUNER),
              this.item(LogicHelper.ITEMS.PROGRESSIVE_PICTO_BOX),
              this.item(LogicHelper.ITEMS.IRON_BOOTS),
              this.item(LogicHelper.ITEMS.MAGIC_ARMOR),
              this.item(LogicHelper.ITEMS.BAIT_BAG),
              this.item(LogicHelper.ITEMS.PROGRESSIVE_BOW),
              this.item(LogicHelper.ITEMS.BOMBS),
              this.item(LogicHelper.ITEMS.MIRROR_SHIELD),

              this.item(LogicHelper.ITEMS.CABANA_DEED),
              this.item(LogicHelper.ITEMS.MAGGIES_LETTER),
              this.item(LogicHelper.ITEMS.MOBLINS_LETTER),
              this.item(LogicHelper.ITEMS.NOTE_TO_MOM),
              this.item(LogicHelper.ITEMS.DELIVERY_BAG),
              this.item(LogicHelper.ITEMS.HOOKSHOT),
              this.item(LogicHelper.ITEMS.SKULL_HAMMER),
              this.item(LogicHelper.ITEMS.POWER_BRACELETS),

              this.item(LogicHelper.ITEMS.EMPTY_BOTTLE),
              this.item(LogicHelper.ITEMS.WINDS_REQUIEM),
              this.item(LogicHelper.ITEMS.BALLAD_OF_GALES),
              this.item(LogicHelper.ITEMS.COMMAND_MELODY),
              this.item(LogicHelper.ITEMS.EARTH_GODS_LYRIC),
              this.item(LogicHelper.ITEMS.WIND_GODS_ARIA),
              this.item(LogicHelper.ITEMS.SONG_OF_PASSING),
              this.item(LogicHelper.ITEMS.HEROS_CHARM),
            ]}
            numColumns={8}
          />
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
