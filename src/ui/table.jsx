import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const Table = ({
  elements,
  numColumns,
  wrapCells = true,
  wrapTable = true,
}) => {
  const renderRow = (rowElements) => (
    _.map(rowElements, (element, index) => {
      if (wrapCells) {
        return (
          <td key={index}>{element}</td>
        );
      }
      return element;
    })
  );

  const rows = _.map(
    _.chunk(elements, numColumns),
    (rowElements, index) => (
      <tr key={index}>{renderRow(rowElements)}</tr>
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
};

Table.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.object).isRequired,
  numColumns: PropTypes.number.isRequired,
  wrapCells: PropTypes.bool,
  wrapTable: PropTypes.bool,
};

export default Table;
