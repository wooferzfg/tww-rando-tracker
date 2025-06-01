import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useId } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

function Tooltip({ children, tooltipContent = null }) {
  const tooltipId = useId();

  if (_.isNil(tooltipContent)) {
    return children;
  }

  return (
    <div
      className="tooltip-wrapper"
      data-tooltip-id={tooltipId}
      data-tooltip-place="bottom"
      data-tooltip-variant="light"
    >
      {children}
      <ReactTooltip
        id={tooltipId}
        className="tooltip-element"
      >
        {tooltipContent}
      </ReactTooltip>
    </div>
  );
}

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  tooltipContent: PropTypes.node,
};

export default Tooltip;
