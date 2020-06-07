import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

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

  const optionRows = _.map(
    _.chunk(options, numColumns),
    (rowElements, index) => (
      <tr key={index}>{rowElements}</tr>
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
          {optionRows}
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
