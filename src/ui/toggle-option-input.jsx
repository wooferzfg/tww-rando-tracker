import PropTypes from 'prop-types';
import React from 'react';
import Toggle from 'react-toggle';

class ToggleOptionInput extends React.PureComponent {
  render() {
    const {
      labelText,
      optionName,
      optionValue,
      setOptionValue,
    } = this.props;

    return (
      <>
        <td className="label-text">{labelText}</td>
        <td className="option-container">
          <div className="toggle-container">
            <Toggle
              checked={optionValue}
              icons={false}
              onChange={(event) => setOptionValue(optionName, event.target.checked)}
              aria-label={labelText}
            />
          </div>
        </td>
      </>
    );
  }
}

ToggleOptionInput.propTypes = {
  labelText: PropTypes.string.isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.bool.isRequired,
  setOptionValue: PropTypes.func.isRequired,
};

export default ToggleOptionInput;
