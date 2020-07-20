import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Permalink from '../services/permalink';

class DropdownOptionInput extends React.PureComponent {
  render() {
    const {
      getOptionValue,
      labelText,
      optionName,
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

    return (
      <>
        <td className="label-text">{labelText}</td>
        <td className="option-container">
          <div className="select-container">
            <select
              onChange={
                (event) => setOptionValue(
                  optionName,
                  _.get(optionsList, event.target.selectedIndex),
                )
              }
              value={getOptionValue(optionName)}
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
  getOptionValue: PropTypes.func.isRequired,
  labelText: PropTypes.string.isRequired,
  optionName: PropTypes.string.isRequired,
  setOptionValue: PropTypes.func.isRequired,
};

export default DropdownOptionInput;
