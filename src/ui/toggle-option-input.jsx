import PropTypes from 'prop-types';
import React from 'react';
import Toggle from 'react-toggle';

const ToggleOptionInput = ({
  getOptionValue,
  labelText,
  optionName,
}) => (
  <>
    <td className="label-text">{labelText}</td>
    <td className="option-container">
      <div className="toggle-container">
        <Toggle
          checked={getOptionValue(optionName)}
          icons={false}
        />
      </div>
    </td>
  </>
);

ToggleOptionInput.propTypes = {
  getOptionValue: PropTypes.func.isRequired,
  labelText: PropTypes.string.isRequired,
  optionName: PropTypes.string.isRequired,
};

export default ToggleOptionInput;
