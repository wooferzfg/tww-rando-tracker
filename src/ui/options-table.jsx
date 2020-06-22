import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Table from './table';

const OptionsTable = ({
  options,
  numColumns,
  title,
}) => {
  const columns = _.times(
    numColumns,
    (index) => (
      <React.Fragment key={index}>
        <col className="text-col" />
        <col className="slider-col" />
      </React.Fragment>
    ),
  );

  return (
    <fieldset>
      <legend>{title}</legend>
      <table>
        <colgroup>
          {columns}
        </colgroup>
        <tbody>
          <Table
            elements={options}
            numColumns={numColumns}
            wrapCells={false}
            wrapTable={false}
          />
        </tbody>
      </table>
    </fieldset>
  );
};

OptionsTable.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  numColumns: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default OptionsTable;
