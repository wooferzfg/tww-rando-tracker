import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import Hints from '../services/hints';
import LogicHelper from '../services/logic-helper';
import TrackerState from '../services/tracker-state';

import ContextMenuWrapper from './context-menu-wrapper';
import ExtraLocationsTable from './extra-locations-table';

class HintsTable extends React.PureComponent {
  static WIDTH_DIFFERENCE = -10;

  static getWidth() {
    return ExtraLocationsTable.getWidth() + this.WIDTH_DIFFERENCE;
  }

  static hintRow(key, hintText, removeFunc) {
    const removeHintFunc = (event) => {
      event.preventDefault();

      removeFunc();
    };

    return (
      <div
        className="hint-row"
        key={key}
        onContextMenu={ContextMenuWrapper.onRightClick(removeHintFunc)}
        title={hintText}
      >
        {hintText}
      </div>
    );
  }

  pendingSelection() {
    const { hintMode, pendingSelection } = this.props;

    if (!hintMode) {
      return null;
    }

    let pendingText;
    if (_.isNil(pendingSelection)) {
      pendingText = 'select an item, a boss, or a location';
    } else {
      const {
        detailedLocation,
        generalLocation,
        goal,
        itemName,
        type,
      } = pendingSelection;

      if (type === Hints.SELECTION_TYPES.GOAL) {
        pendingText = `path to ${Hints.goalName(goal)}`;
      } else if (type === Hints.SELECTION_TYPES.ITEM) {
        pendingText = LogicHelper.prettyNameForItem(itemName, null);
      } else {
        pendingText = Hints.locationText(generalLocation, detailedLocation);
      }
    }

    return (
      <div className="hints-pending">
        {`Hint Mode: ${pendingText}`}
      </div>
    );
  }

  pathHints() {
    const { removePathHint, trackerState } = this.props;

    const pathHints = trackerState.getPathHints();

    if (_.isEmpty(pathHints)) {
      return <div className="no-hints">No path hints</div>;
    }

    return _.map(pathHints, ({ zone, goal }) => HintsTable.hintRow(
      `${zone}-${goal}`,
      Hints.pathHintText({ zone, goal }),
      () => removePathHint(zone, goal),
    ));
  }

  itemHints() {
    const { removeItemHint, trackerState } = this.props;

    const itemHints = trackerState.getItemHints();

    if (_.isEmpty(itemHints)) {
      return <div className="no-hints">No item hints</div>;
    }

    return _.map(itemHints, ({ itemName, generalLocation, detailedLocation }) => {
      const locationText = Hints.locationText(generalLocation, detailedLocation);
      const prettyItemName = LogicHelper.prettyNameForItem(itemName, null);

      return HintsTable.hintRow(
        `${itemName}-${locationText}`,
        `${prettyItemName} → ${locationText}`,
        () => removeItemHint(itemName, generalLocation, detailedLocation),
      );
    });
  }

  render() {
    const { backgroundColor } = this.props;

    return (
      <div
        className="hints-table"
        style={{ backgroundColor, width: HintsTable.getWidth() }}
      >
        <div className="hints-title">Hints</div>
        {this.pendingSelection()}
        <div className="hints-columns">
          <div className="hints-column left-column">
            <div className="hints-section-title">Path Hints</div>
            {this.pathHints()}
          </div>
          <div className="hints-column right-column">
            <div className="hints-section-title">Item Hints</div>
            {this.itemHints()}
          </div>
        </div>
      </div>
    );
  }
}

HintsTable.defaultProps = {
  backgroundColor: null,
  pendingSelection: null,
};

HintsTable.propTypes = {
  backgroundColor: PropTypes.string,
  hintMode: PropTypes.bool.isRequired,
  pendingSelection: PropTypes.shape({
    detailedLocation: PropTypes.string,
    generalLocation: PropTypes.string,
    goal: PropTypes.string,
    itemName: PropTypes.string,
    type: PropTypes.string.isRequired,
  }),
  removeItemHint: PropTypes.func.isRequired,
  removePathHint: PropTypes.func.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default HintsTable;
