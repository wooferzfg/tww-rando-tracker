import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';

import Images from './images';

class EntrancesList extends React.PureComponent {
  static NUM_ROWS = 13;

  static entrance(entranceInfo, numColumns) {
    if (_.isNil(entranceInfo)) {
      return null;
    }

    const {
      entrance,
      color,
    } = entranceInfo;

    const shortEntranceName = LogicHelper.shortEntranceName(entrance);

    let fontSizeClassName = '';
    if (numColumns === 3) {
      fontSizeClassName = 'font-smallest';
    } else if (numColumns === 2) {
      fontSizeClassName = 'font-small';
    }

    const entranceElement = (
      <div
        className={`detail-span ${color} ${fontSizeClassName}`}
        role="button"
        tabIndex="0"
      >
        {shortEntranceName}
      </div>
    );

    return (
      <td key={shortEntranceName}>
        {entranceElement}
      </td>
    );
  }

  render() {
    const {
      clearOpenedMenus,
      disableLogic,
      logic,
    } = this.props;

    const entrances = logic.entrancesList({ disableLogic });

    const entranceChunks = _.chunk(entrances, EntrancesList.NUM_ROWS);
    const arrangedEntrances = _.zip(...entranceChunks);
    const numColumns = _.size(entranceChunks);

    const entranceRows = _.map(arrangedEntrances, (locationsRow, index) => (
      <tr key={index}>
        {_.map(locationsRow, (entranceInfo) => EntrancesList.entrance(entranceInfo, numColumns))}
      </tr>
    ));

    return (
      <div className="zoom-map">
        <div className="zoom-map-cover" />
        <div className="zoom-map-background">
          <img src={Images.IMAGES.EMPTY_BACKGROUND} alt="" />
        </div>
        <table className="header-table">
          <tbody>
            <tr>
              <td>
                <div
                  className="detail-span"
                  onClick={clearOpenedMenus}
                  onKeyDown={clearOpenedMenus}
                  role="button"
                  tabIndex="0"
                >
                  X Close
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <table className="detailed-locations-table">
          <tbody>
            {entranceRows}
          </tbody>
        </table>
      </div>
    );
  }
}

EntrancesList.propTypes = {
  clearOpenedMenus: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
};

export default EntrancesList;
