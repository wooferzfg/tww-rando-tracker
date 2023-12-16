import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import LogicCalculation from '../services/logic-calculation';
import LogicHelper from '../services/logic-helper';
import Permalink from '../services/permalink';
import Settings from '../services/settings';
import Spheres from '../services/spheres';
import TrackerState from '../services/tracker-state';

import Images from './images';
import Item from './item';
import KeyDownWrapper from './key-down-wrapper';
import RequirementsTooltip from './requirements-tooltip';
import Tooltip from './tooltip';

class Sector extends React.PureComponent {
  static _COLOR_TO_COUNT_MAPPING = {
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
    } = LogicHelper.chartForIsland(island);

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

  chartIsland() {
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

    const chartForIsland = LogicHelper.chartForIslandName(island);

    const chartCount = trackerState.getItemValue(chartForIsland);

    const chartImages = _.get(Images.IMAGES, ['CHARTS', 'Treasure']);

    let locations = [];
    if (trackSpheres) {
      locations = trackerState.getLocationsForItem(chartForIsland);
    }

    const updateOpenedChartForIslandFunc = () => {
      if (chartCount > 0) {
        unsetChartMapping(chartForIsland, false);
      } else {
        clearSelectedChartForIsland();
        clearSelectedLocation();

        updateOpenedChartForIsland(chartForIsland);
      }
    };

    return (
      <div className="treasure-chart">
        <Item
          clearSelectedItem={clearSelectedChartForIsland}
          images={chartImages}
          incrementItem={updateOpenedChartForIslandFunc}
          itemCount={chartCount}
          itemName={chartForIsland}
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
      unsetExit,
      updateOpenedEntrance,
    } = this.props;

    const itemCount = Sector._COLOR_TO_COUNT_MAPPING[color];
    const shortEntranceName = LogicHelper.shortEntranceName(entrance);

    const setSelectedItemFunc = () => setSelectedEntrance(entrance);

    const incrementItemFunc = () => {
      const exitForEntrance = trackerState.getExitForEntrance(entrance);

      if (!_.isNil(exitForEntrance)) {
        unsetExit(exitForEntrance);
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
      clearSelectedLocation,
      island,
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

    return (
      <div
        className="sea-sector"
        onBlur={clearSelectedLocation}
        onClick={updateOpenedLocationFunc}
        onFocus={setSelectedLocationFunc}
        onKeyDown={KeyDownWrapper.onSpaceKey(updateOpenedLocationFunc)}
        onMouseOver={setSelectedLocationFunc}
        onMouseOut={clearSelectedLocation}
        role="button"
        tabIndex="0"
      >
        {
          Settings.getOptionValue(Permalink.OPTIONS.RANDOMIZE_CHARTS)
            ? this.chartIsland()
            : this.chartItem()
        }
        {this.entranceExitItems()}
        {this.chestsCounter()}
      </div>
    );
  }
}

Sector.propTypes = {
  clearSelectedChartForIsland: PropTypes.func.isRequired,
  clearSelectedItem: PropTypes.func.isRequired,
  clearSelectedLocation: PropTypes.func.isRequired,
  decrementItem: PropTypes.func.isRequired,
  disableLogic: PropTypes.bool.isRequired,
  incrementItem: PropTypes.func.isRequired,
  island: PropTypes.string.isRequired,
  logic: PropTypes.instanceOf(LogicCalculation).isRequired,
  onlyProgressLocations: PropTypes.bool.isRequired,
  setSelectedChartForIsland: PropTypes.func.isRequired,
  setSelectedEntrance: PropTypes.func.isRequired,
  setSelectedExit: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setSelectedLocation: PropTypes.func.isRequired,
  spheres: PropTypes.instanceOf(Spheres).isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
  trackSpheres: PropTypes.bool.isRequired,
  unsetChartMapping: PropTypes.func.isRequired,
  unsetExit: PropTypes.func.isRequired,
  updateOpenedChartForIsland: PropTypes.func.isRequired,
  updateOpenedEntrance: PropTypes.func.isRequired,
  updateOpenedExit: PropTypes.func.isRequired,
  updateOpenedLocation: PropTypes.func.isRequired,
  viewingEntrances: PropTypes.bool.isRequired,
};

export default Sector;
