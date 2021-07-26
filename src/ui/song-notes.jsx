import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import SONG_NOTES from '../data/song-notes.json';
import Spheres from '../services/spheres';

import FoundAtTooltip from './found-at-tooltip';
import Images from './images';
import Tooltip from './tooltip';

class SongNotes extends React.PureComponent {
  render() {
    const {
      children,
      locations,
      songCount,
      songName,
      spheres,
    } = this.props;

    let songNotes;

    if (songCount > 0) {
      const noteImages = _.map(
        _.get(SONG_NOTES, songName),
        (note, index) => (
          <img
            src={_.get(Images.IMAGES.SONG_NOTES, note)}
            key={index}
            alt={note}
          />
        ),
      );

      songNotes = (
        <>
          <div className="song-notes">
            {noteImages}
          </div>
          {!_.isEmpty(locations) && (
            <FoundAtTooltip locations={locations} spheres={spheres} />
          )}
        </>
      );
    }

    return (
      <Tooltip tooltipContent={songNotes}>
        {children}
      </Tooltip>
    );
  }
}

SongNotes.propTypes = {
  children: PropTypes.element.isRequired,
  locations: PropTypes.arrayOf(PropTypes.exact({
    generalLocation: PropTypes.string.isRequired,
    detailedLocation: PropTypes.string.isRequired,
  })),
  songCount: PropTypes.number.isRequired,
  songName: PropTypes.string.isRequired,
  spheres: PropTypes.instanceOf(Spheres),
};

SongNotes.defaultProps = {
  locations: [],
  spheres: null,
};

export default SongNotes;
