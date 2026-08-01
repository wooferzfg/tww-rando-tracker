import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import ContextMenuWrapper from './context-menu-wrapper';
import KeyDownWrapper from './key-down-wrapper';

class MapTable extends React.PureComponent {
  static MAX_COLUMNS = 3;

  static groupIntoChunks(tableItems, mappingFunc, numRows) {
    const numItems = _.size(tableItems);
    const numColumns = Math.min(
      Math.ceil(numItems / numRows),
      this.MAX_COLUMNS,
    );
    const updatedNumRows = Math.ceil(numItems / numColumns);
    const chunks = _.chunk(tableItems, updatedNumRows);
    const arrangedItems = _.zip(...chunks);

    return _.map(arrangedItems, (tableRow, index) => (
      <tr key={index}>
        {_.map(tableRow, (item) => mappingFunc(item, numColumns, updatedNumRows))}
      </tr>
    ));
  }

  constructor(props) {
    super(props);

    this.rightClickTable = this.rightClickTable.bind(this);
  }

  rightClickTable(event) {
    event.preventDefault();

    const { closeFunc } = this.props;
    closeFunc();
  }

  render() {
    const {
      backgroundImage,
      closeFunc,
      headerCellsBeforeClose,
      headerCellsAfterClose,
      tableRows,
    } = this.props;

    return (
      <div
        className="zoom-map"
        onContextMenu={
          ContextMenuWrapper.onRightClick(this.rightClickTable)
        }
      >
        <div className="zoom-map-cover" />
        <div className="zoom-map-background">
          <img src={backgroundImage} alt="" />
        </div>
        <table className="header-table">
          <tbody>
            <tr>
              {headerCellsBeforeClose}
              <td>
                <div
                  className="detail-span"
                  onClick={closeFunc}
                  onKeyDown={KeyDownWrapper.onSpaceKey(closeFunc)}
                  role="button"
                  tabIndex="0"
                >
                  X Close
                </div>
              </td>
              {headerCellsAfterClose}
            </tr>
          </tbody>
        </table>
        <table className="detailed-locations-table">
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }
}

MapTable.defaultProps = {
  headerCellsAfterClose: null,
  headerCellsBeforeClose: null,
};

MapTable.propTypes = {
  backgroundImage: PropTypes.node.isRequired,
  closeFunc: PropTypes.func.isRequired,
  headerCellsAfterClose: PropTypes.element,
  headerCellsBeforeClose: PropTypes.element,
  tableRows: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default MapTable;
