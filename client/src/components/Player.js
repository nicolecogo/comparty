import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faBackward, faForward } from '@fortawesome/free-solid-svg-icons'

function Player () {
  const playIcon = <FontAwesomeIcon icon={faPlay} />
  const pauseIcon = <FontAwesomeIcon icon={faPause} />
  const prevIcon = <FontAwesomeIcon icon={faBackward} />
  const nextIcon = <FontAwesomeIcon icon={faForward} />
  return (
    <div className="Player">
      <div className="controls">
        <button className="button">{prevIcon}</button>
        <button className="button">{playIcon}</button>
        <button className="button">{nextIcon}</button>
      </div>
      <div className="info">
        <h3>Current Playing...</h3>
      </div>
    </div>
    );
}

export default Player;