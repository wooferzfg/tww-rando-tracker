import PropTypes from 'prop-types';
import React from 'react';

import KeyDownWrapper from './key-down-wrapper';

class MapTable extends React.PureComponent {
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
      <div className="zoom-map" onContextMenu={this.rightClickTable}>
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
