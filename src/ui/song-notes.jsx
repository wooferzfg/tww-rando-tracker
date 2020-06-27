import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import SONG_NOTES from '../data/song-notes.json';
import TrackerState from '../services/tracker-state';

import Images from './images';

const SongNotes = ({
  children,
  songName,
  trackerState,
}) => {
  const tooltipId = `${songName}-tooltip`;

  let songNotes;
  const itemCount = trackerState.getItemValue(songName);

  if (itemCount > 0) {
    songNotes = _.map(
      _.get(SONG_NOTES, songName),
      (note) => (
        <img src={_.get(Images.IMAGES.SONG_NOTES, note)} alt={note} />
      ),
    );
  }

  return (
    <div className="song-container" data-tip data-for={tooltipId}>
      {children}
      {
        songNotes && (
          <ReactTooltip
            effect="solid"
            id={tooltipId}
            place="bottom"
            type="light"
          >
            <div className="song-notes">{songNotes}</div>
          </ReactTooltip>
        )
      }
    </div>
  );
};

SongNotes.propTypes = {
  children: PropTypes.element.isRequired,
  songName: PropTypes.string.isRequired,
  trackerState: PropTypes.instanceOf(TrackerState).isRequired,
};

export default SongNotes;
