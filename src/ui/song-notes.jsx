import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import SONG_NOTES from '../data/song-notes.json';
import TrackerState from '../services/tracker-state';

import Images from './images';
import Tooltip from './tooltip';

const SongNotes = ({
  children,
  songName,
  trackerState,
}) => {
  let songNotes;
  const itemCount = trackerState.getItemValue(songName);

  if (itemCount > 0) {
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
      <div className="song-notes">
        {noteImages}
      </div>
    );
  }

  return (
    <Tooltip tooltipContent={songNotes}>
      {children}
    </Tooltip>
  );
};

SongNotes.propTypes = {
  children: PropTypes.element.isRequired,
  songName: PropTypes.string.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default SongNotes;
