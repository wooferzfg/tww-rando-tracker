import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Permalink from '../services/permalink';
import Settings from '../services/settings';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import ContextMenuWrapper from './context-menu-wrapper';
import Images from './images';
import Item from './item';
import KeyDownWrapper from './key-down-wrapper';
import RequirementsTooltip from './requirements-tooltip';
import Tooltip from './tooltip';

class Sector extends React.PureComponent {
  static #COLOR_TO_COUNT_MAPPING = {
    [LogicCalculation.LOCATION_COLORS.UNAVAILABLE_LOCATION]: 0,
    [LogicCalculation.LOCATION_COLORS.AVAILABLE_LOCATION]: 1,
    [LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION]: 2,
  };

  chestsCounter() {
    const {
      disableLogic,
      island,
      logic,
      onlyProgressLocations,
    } = this.props;

    const {
      color,
      numAvailable,
      numRemaining,
    } = logic.locationCounts(island, {
      onlyProgressLocations,
      disableLogic,
    });

    const className = `chests-counter ${color}`;
    const chestCounts = disableLogic ? numRemaining : `${numAvailable}/${numRemaining}`;

    return (
      <div className={className}>
        {chestCounts}
      </div>
    );
  }

  chartItem() {
    const { island, trackNonProgressCharts } = this.props;

    if (!trackNonProgressCharts && !LogicHelper.islandHasProgressItemChart(island)) {
      return null;
    }
    if (Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS)) {
      return this.chartItemRandomizedCharts();
    }
    return this.chartItemVanilla();
  }

  chartItemVanilla() {
    const {
      clearSelectedItem,
      decrementItem,
      incrementItem,
      island,
      setSelectedItem,
      spheres,
      trackerState,
      trackSpheres,
    } = this.props;

    const {
      chartName,
      chartType,
    } = LogicHelper.vanillaChartForIsland(island);

    const chartCount = trackerState.getItemValue(chartName);

    const chartImages = _.get(Images.IMAGES, ['CHARTS', chartType]);

    let locations = [];
    if (trackSpheres) {
      locations = trackerState.getLocationsForItem(chartName);
    }

    return (
      <div className="treasure-chart">
        <Item
          clearSelectedItem={clearSelectedItem}
          decrementItem={decrementItem}
          images={chartImages}
          incrementItem={incrementItem}
          itemCount={chartCount}
          itemName={chartName}
          locations={locations}
          setSelectedItem={setSelectedItem}
          spheres={spheres}
        />
      </div>
    );
  }

  chartItemRandomizedCharts() {
    const {
      clearSelectedChartForIsland,
      clearSelectedLocation,
      island,
      setSelectedChartForIsland,
      spheres,
      trackerState,
      trackSpheres,
      updateOpenedChartForIsland,
      unsetChartMapping,
    } = this.props;

    const randomizedChartName = LogicHelper.randomizedChartForIsland(island);

    const chartCount = trackerState.getItemValue(randomizedChartName);

    const chartImages = _.get(Images.IMAGES, ['CHARTS', 'Treasure']);

    let locations = [];
    if (trackSpheres) {
      locations = trackerState.getLocationsForItem(randomizedChartName);
    }

    const updateOpenedChartForIslandFunc = () => {
      if (chartCount > 0) {
        unsetChartMapping(randomizedChartName, false);
      } else {
        clearSelectedChartForIsland();
        clearSelectedLocation();

        updateOpenedChartForIsland(randomizedChartName);
      }
    };

    return (
      <div className="treasure-chart">
        <Item
          clearSelectedItem={clearSelectedChartForIsland}
          images={chartImages}
          incrementItem={updateOpenedChartForIslandFunc}
          itemCount={chartCount}
          itemName={randomizedChartName}
          locations={locations}
          setSelectedItem={setSelectedChartForIsland}
          spheres={spheres}
        />
      </div>
    );
  }

  islandEntrance(entranceInfo) {
    const {
      entrance,
      color,
    } = entranceInfo;

    const {
      clearSelectedItem,
      clearSelectedLocation,
      disableLogic,
      logic,
      setSelectedEntrance,
      trackerState,
      unsetEntrance,
      updateOpenedEntrance,
    } = this.props;

    const itemCount = Sector.#COLOR_TO_COUNT_MAPPING[color];
    const shortEntranceName = LogicHelper.shortEntranceName(entrance);

    const setSelectedItemFunc = () => setSelectedEntrance(entrance);

    const incrementItemFunc = () => {
      const isEntranceChecked = trackerState.isEntranceChecked(entrance);

      if (isEntranceChecked) {
        unsetEntrance(entrance);
      } else {
        clearSelectedItem();
        clearSelectedLocation();

        updateOpenedEntrance(entrance);
      }
    };

    let entranceElement = (
      <Item
        clearSelectedItem={clearSelectedItem}
        images={Images.IMAGES.ISLAND_ENTRANCE}
        incrementItem={incrementItemFunc}
        itemCount={itemCount}
        itemName={shortEntranceName}
        setSelectedItem={setSelectedItemFunc}
      />
    );

    if (!disableLogic && color !== LogicCalculation.LOCATION_COLORS.CHECKED_LOCATION) {
      const requirements = logic.formattedRequirementsForEntrance(entrance);
      const requirementsTooltip = (
        <RequirementsTooltip requirements={requirements} />
      );
      entranceElement = (
        <Tooltip tooltipContent={requirementsTooltip}>
          {entranceElement}
        </Tooltip>
      );
    }

    return (
      <div className="cave-entry" key={entrance}>
        {entranceElement}
      </div>
    );
  }

  islandExit(exitName) {
    const {
      clearSelectedItem,
      clearSelectedLocation,
      setSelectedExit,
      trackerState,
      unsetExit,
      updateOpenedExit,
    } = this.props;

    const entryName = LogicHelper.entryName(exitName);
    const entryCount = trackerState.getItemValue(entryName);

    const setSelectedItemFunc = () => setSelectedExit(exitName);

    const incrementItemFunc = () => {
      if (entryCount > 0) {
        unsetExit(exitName);
      } else {
        clearSelectedItem();
        clearSelectedLocation();

        updateOpenedExit(exitName);
      }
    };

    return (
      <div className="cave-entry" key={entryName}>
        <Item
          clearSelectedItem={clearSelectedItem}
          images={Images.IMAGES.ISLAND_EXIT}
          incrementItem={incrementItemFunc}
          itemCount={entryCount}
          itemName={entryName}
          setSelectedItem={setSelectedItemFunc}
        />
      </div>
    );
  }

  entranceExitItems() {
    const {
      disableLogic,
      island,
      logic,
      viewingEntrances,
    } = this.props;

    if (viewingEntrances) {
      const islandEntrances = logic.entrancesListForIsland(island, { disableLogic });
      return _.map(islandEntrances, (islandEntrance) => this.islandEntrance(islandEntrance));
    }

    const islandExits = LogicHelper.exitsForIsland(island);
    return _.map(islandExits, (exitName) => this.islandExit(exitName));
  }

  render() {
    const {
      clearAllLocations,
      clearSelectedLocation,
      island,
      rightClickToClearAll,
      setSelectedLocation,
      updateOpenedLocation,
    } = this.props;

    const updateOpenedLocationFunc = () => {
      clearSelectedLocation();

      updateOpenedLocation({
        isDungeon: false,
        locationName: island,
      });
    };

    const setSelectedLocationFunc = () => setSelectedLocation({ locationName: island });

    const clearAllLocationsFunc = (event) => {
      event.preventDefault();

      if (rightClickToClearAll) {
        clearAllLocations(island);
      }
    };

    return (
      <div
        className="sea-sector"
        onBlur={clearSelectedLocation}
        onClick={updateOpenedLocationFunc}
        onContextMenu={ContextMenuWrapper.onRightClick(clearAllLocationsFunc)}
        onFocus={setSelectedLocationFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(updateOpenedLocationFunc)}
        onMouseOver={setSelectedLocationFunc}
        onMouseOut={clearSelectedLocation}
        role="button"
        tabIndex="0"
      >
        {this.chartItem()}
        {this.entranceExitItems()}
        {this.chestsCounter()}
      </div>
    );
  }
}

Sector.propTypes = {
  clearAllLocations: PropTypes.func.isRequired,
  clearSelectedChartForIsland: PropTypes.func.isRequired,
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  island: PropTypes.string.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  rightClickToClearAll: PropTypes.bool.isRequired,
  setSelectedChartForIsland: PropTypes.func.isRequired,
  setSelectedEntrance: PropTypes.func.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackNonProgressCharts: PropTypes.bool.isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  unsetChartMapping: PropTypes.func.isRequired,
  unsetEntrance: PropTypes.func.isRequired,
  unsetExit: PropTypes.func.isRequired,
  updateOpenedChartForIsland: PropTypes.func.isRequired,
  updateOpenedEntrance: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
  viewingEntrances: PropTypes.bool.isRequired,
};

export default Sector;
