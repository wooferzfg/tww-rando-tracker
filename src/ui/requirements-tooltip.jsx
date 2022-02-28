import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

class RequirementsTooltip extends React.PureComponent {
  render() {
    const { requirements } = this.props;

    const requirementsList = _.map(requirements, (elements, rowIndex) => (
      <li key={rowIndex}>
        {
          _.map(elements, ({ color, text }, elementIndex) => (
            <span className={color} key={elementIndex}>{text}</span>
          ))
        }
      </li>
    ));

    return (
      <div className="tooltip">
        <div className="tooltip-title">Items Required</div>
        <ul>
          {requirementsList}
        </ul>
      </div>
    );
  }
}

RequirementsTooltip.propTypes = {
  requirements: PropTypes.arrayOf(PropTypes.arrayOf(
    PropTypes.exact({
      color: PropTypes.string,
      text: PropTypes.string,
    }),
  )).isRequired,
};

export default RequirementsTooltip;
