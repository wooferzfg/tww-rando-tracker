import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

class Tooltip extends React.PureComponent {
  render() {
    const {
      children,
      tooltipContent,
    } = this.props;

    if (_.isNil(tooltipContent)) {
      return children;
    }

    const tooltipId = _.uniqueId('tooltip');

    return (
      <div
        className="tooltip-wrapper"
        data-tooltip-content
        id={tooltipId}
        data-tooltip-place="bottom"
        data-tooltip-variant="light"
      >
        {children}
        <ReactTooltip
          anchorId={tooltipId}
          className="tooltip-element"
        >
          {tooltipContent}
        </ReactTooltip>
      </div>
    );
  }
}

Tooltip.defaultProps = {
  tooltipContent: null,
};

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  tooltipContent: PropTypes.node,
};

export default Tooltip;
