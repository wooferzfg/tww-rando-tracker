import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

class Table extends React.PureComponent {
  renderRow(rowElements) {
    const { wrapCells } = this.props;

    return _.map(rowElements, (element, index) => {
      if (wrapCells) {
        return (
          <td key={index}>{element}</td>
        );
      }
      return element;
    });
  }

  render() {
    const {
      elements,
      numColumns,
      wrapTable,
    } = this.props;

    const rows = _.map(
      _.chunk(elements, numColumns),
      (rowElements, index) => (
        <tr key={index}>{this.renderRow(rowElements)}</tr>
      ),
    );

    if (wrapTable) {
      return (
        <table>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    }

    return rows;
  }
}

Table.defaultProps = {
  wrapCells: true,
  wrapTable: true,
};

Table.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.element).isRequired,
  numColumns: PropTypes.number.isRequired,
  wrapCells: PropTypes.bool,
  wrapTable: PropTypes.bool,
};

export default Table;
