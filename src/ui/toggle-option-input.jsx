import PropTypes from 'prop-types';
import React from 'react';
import Toggle from 'react-toggle';

const ToggleOptionInput = ({
  getOptionValue,
  labelText,
  optionName,
  setOptionValue,
}) => (
  <>
    <td className="label-text">{labelText}</td>
    <td className="option-container">
      <div className="toggle-container">
        <Toggle
          checked={getOptionValue(optionName)}
          icons={false}
          onChange={(event) => setOptionValue(optionName, event.target.checked)}
        />
      </div>
    </td>
  </>
);

ToggleOptionInput.propTypes = {
  getOptionValue: PropTypes.func.isRequired,
  labelText: PropTypes.string.isRequired,
  optionName: PropTypes.string.isRequired,
  setOptionValue: PropTypes.func.isRequired,
};

export default ToggleOptionInput;
