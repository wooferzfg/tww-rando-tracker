import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicHelper from '../services/logic-helper';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

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

    const itemCount = trackerState.getItemValue(selectedItem);
    const itemInfoText = LogicHelper.prettyNameForItem(selectedItem, itemCount);

    return (
      <span className="item-info">
        {itemInfoText}
      </span>
    );
  }

  item(itemName, showLocationTooltip = true) {
    const {
      decrementItem,
      incrementItem,
      spheres,
      trackerState,
      trackSpheres,
    } = this.props;

    const itemCount = trackerState.getItemValue(itemName);
    const itemImages = _.get(Images.IMAGES, ['ITEMS', itemName]);

    let locations = [];
    if (showLocationTooltip && trackSpheres) {
      locations = trackerState.getLocationsForItem(itemName);
    }

    return (
      <Item
        clearSelectedItem={this.clearSelectedItem}
        decrementItem={decrementItem}
        images={itemImages}
        incrementItem={incrementItem}
        itemCount={itemCount}
        itemName={itemName}
        locations={locations}
        setSelectedItem={this.setSelectedItem}
        spheres={spheres}
      />
    );
  }

  song(songName) {
    const { trackerState, trackSpheres, spheres } = this.props;

    const songCount = trackerState.getItemValue(songName);
    const locations = trackSpheres ? trackerState.getLocationsForItem(songName) : [];

    return (
      <SongNotes
        locations={locations}
        songCount={songCount}
        songName={songName}
        spheres={spheres}
      >
        {this.item(songName, false)}
      </SongNotes>
    );
  }

  render() {
    const { backgroundColor } = this.props;

    return (
      <div className={`item-tracker ${backgroundColor ? 'single-color' : ''}`}>
        <div
          className="item-tracker-background"
          style={{ backgroundColor }}
        >
          <img src={Images.IMAGES.ITEMS_TABLE_BACKGROUND} alt="" />
        </div>
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
                this.item(LogicHelper.ITEMS.PROGRESSIVE_SHIELD),

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
                  this.item(LogicHelper.ITEMS.PROGRESSIVE_MAGIC_METER),
                ]}
                numColumns={4}
              />
            </div>
          </div>
        </div>
        {this.itemInfo()}
      </div>
    );
  }
}

ItemsTable.defaultProps = {
  backgroundColor: null,
};

ItemsTable.propTypes = {
  backgroundColor: PropTypes.string,
  decrementItem: PropTypes.func.isRequired,
  incrementItem: PropTypes.func.isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackSpheres: PropTypes.bool.isRequired,
};

export default ItemsTable;
