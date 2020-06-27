import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

const Tooltip = ({
  children,
  tooltipContent,
}) => {
  if (_.isNil(tooltipContent)) {
    return children;
  }

  const tooltipId = _.uniqueId('tooltip');

  return (
    <div className="tooltip-wrapper" data-tip data-for={tooltipId}>
      {children}
      <ReactTooltip
        effect="solid"
        id={tooltipId}
        place="bottom"
        type="light"
      >
        {tooltipContent}
      </ReactTooltip>
    </div>
  );
};

Tooltip.defaultProps = {
  tooltipContent: null,
};

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  tooltipContent: PropTypes.node,
};

export default Tooltip;
