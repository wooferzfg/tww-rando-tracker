import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import ChartsTable from './charts-table';
import Images from './images';
import Item from './item';
import SongNotes from './song-notes';
import Table from './table';

class ItemsTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { selectedItem: null };

    this.setSelectedItem = this.setSelectedItem.bind(this);
    this.clearSelectedItem = this.clearSelectedItem.bind(this);
  }

  setSelectedItem(itemName) {
    this.setState({ selectedItem: itemName });
  }

  clearSelectedItem() {
    this.setState({ selectedItem: null });
  }

  itemInfo() {
    const { selectedItem } = this.state;
    const { trackerState } = this.props;

    if (_.isNil(selectedItem)) {
      return null;
    }

    let itemInfoText;
    if (_.includes(selectedItem, 'Chart ')) {
      itemInfoText = selectedItem;
    } else {
      const itemCount = trackerState.getItemValue(selectedItem);
      itemInfoText = LogicHelper.prettyNameForItem(selectedItem, itemCount);
    }

    return (
      <span className="item-info">{itemInfoText}</span>
    );
  }

  item(itemName) {
    const {
      incrementItem,
      trackerState,
    } = this.props;

    const itemCount = trackerState.getItemValue(itemName);
    const itemImages = _.get(Images.IMAGES, ['ITEMS', itemName]);

    return (
      <Item
        clearSelectedItem={this.clearSelectedItem}
        images={itemImages}
        incrementItem={incrementItem}
        itemCount={itemCount}
        itemName={itemName}
        setSelectedItem={this.setSelectedItem}
      />
    );
  }

  song(songName) {
    const { trackerState } = this.props;

    const songCount = trackerState.getItemValue(songName);

    return (
      <SongNotes
        songCount={songCount}
        songName={songName}
      >
        {this.item(songName)}
      </SongNotes>
    );
  }

  render() {
    const {
      incrementItem,
      itemTrackerOpen,
      singleColorBackground,
      trackerState,
      unsetChart,
      updateOpenedChart,
    } = this.props;

    let trackerElement;
    if (itemTrackerOpen) {
      trackerElement = (
        <div className="item-tracker-items">
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
                this.song(LogicHelper.ITEMS.WINDS_REQUIEM),
                this.song(LogicHelper.ITEMS.BALLAD_OF_GALES),
                this.song(LogicHelper.ITEMS.COMMAND_MELODY),
                this.song(LogicHelper.ITEMS.EARTH_GODS_LYRIC),
                this.song(LogicHelper.ITEMS.WIND_GODS_ARIA),
                this.song(LogicHelper.ITEMS.SONG_OF_PASSING),
                this.item(LogicHelper.ITEMS.HEROS_CHARM),
              ]}
              numColumns={8}
            />
          </div>
          <div className="other-items">
            <table className="triforce-and-pearls">
              <tbody>
                <tr>
                  <td>
                    <div className="pearls">
                      <div className="nayrus-pearl">
                        {this.item(LogicHelper.ITEMS.NAYRUS_PEARL)}
                      </div>
                      <div className="dins-pearl">
                        {this.item(LogicHelper.ITEMS.DINS_PEARL)}
                      </div>
                      <div className="farores-pearl">
                        {this.item(LogicHelper.ITEMS.FARORES_PEARL)}
                      </div>
                      <div className="pearl-holder">
                        <img src={Images.IMAGES.PEARL_HOLDER} alt="" />
                      </div>
                    </div>
                  </td>
                  <td>
                    {this.item(LogicHelper.ITEMS.TRIFORCE_SHARD)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="misc-items">
              <Table
                elements={[
                  null,
                  this.item(LogicHelper.ITEMS.TINGLE_STATUE),
                  this.item(LogicHelper.ITEMS.GHOST_SHIP_CHART),
                  this.item(LogicHelper.ITEMS.HURRICANE_SPIN),
                  this.item(LogicHelper.ITEMS.PROGRESSIVE_BOMB_BAG),
                  this.item(LogicHelper.ITEMS.PROGRESSIVE_QUIVER),
                  this.item(LogicHelper.ITEMS.PROGRESSIVE_WALLET),
                  this.item(LogicHelper.ITEMS.MAGIC_METER_UPGRADE),
                ]}
                numColumns={4}
              />
            </div>
          </div>
        </div>
      );
    } else {
      trackerElement = (
        <ChartsTable
          clearSelectedItem={this.clearSelectedItem}
          incrementItem={incrementItem}
          setSelectedItem={this.setSelectedItem}
          trackerState={trackerState}
          unsetChart={unsetChart}
          updateOpenedChart={updateOpenedChart}
        />
      );
    }

    return (
      <div className={`item-tracker ${singleColorBackground ? 'single-color' : ''}`}>
        <div className="item-tracker-background">
          <img src={Images.IMAGES.ITEMS_TABLE_BACKGROUND} alt="" />
        </div>
        {trackerElement}
        {this.itemInfo()}
      </div>
    );
  }
}

ItemsTable.propTypes = {
  incrementItem: PropTypes.func.isRequired,
  itemTrackerOpen: PropTypes.bool.isRequired,
  singleColorBackground: PropTypes.bool.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  unsetChart: PropTypes.func.isRequired,
  updateOpenedChart: PropTypes.func.isRequired,
};

export default ItemsTable;
