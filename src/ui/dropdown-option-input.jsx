import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Permalink from '../services/permalink';

class DropdownOptionInput extends React.PureComponent {
  render() {
    const {
      isDisabled,
      labelText,
      optionName,
      optionValue,
      setOptionValue,
    } = this.props;

    const optionsList = _.get(Permalink.DROPDOWN_OPTIONS, optionName);
    const dropdownOptions = _.map(
      optionsList,
      (option) => (
        <option value={option} key={option}>
          {option}
        </option>
      ),
    );

    const labelClassName = `label-text ${isDisabled ? 'label-disabled' : ''}`;

    return (
      <>
        <td className={labelClassName}>{labelText}</td>
        <td className="option-container">
          <div className="select-container">
            <select
              onChange={
                (event) => setOptionValue(
                  optionName,
                  _.get(optionsList, event.target.selectedIndex),
                )
              }
              value={optionValue}
              className={isDisabled ? 'select-disabled' : ''}
              disabled={isDisabled}
            >
              {dropdownOptions}
            </select>
          </div>
        </td>
      </>
    );
  }
}

DropdownOptionInput.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  labelText: PropTypes.string.isRequired,
  optionName: PropTypes.string.isRequired,
  optionValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setOptionValue: PropTypes.func.isRequired,
};

export default DropdownOptionInput;
