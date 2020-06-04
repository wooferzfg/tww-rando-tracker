import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Permalink from '../services/permalink';

const DropdownOptionInput = ({
  getOptionValue,
  labelText,
  optionName,
}) => {
  const dropdownOptions = _.map(
    _.get(Permalink.DROPDOWN_OPTIONS, optionName),
    (option) => (
      <option value={option} key={option}>
        {option}
      </option>
    ),
  );

  return (
    <>
      <td className="label-text">{labelText}</td>
      <td className="option-container">
        <div className="select-container">
          <select value={getOptionValue(optionName)}>
            {dropdownOptions}
          </select>
        </div>
      </td>
    </>
  );
};

DropdownOptionInput.propTypes = {
  getOptionValue: PropTypes.func.isRequired,
  labelText: PropTypes.string.isRequired,
  optionName: PropTypes.string.isRequired,
};

export default DropdownOptionInput;
