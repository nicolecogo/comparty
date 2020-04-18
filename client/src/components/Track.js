import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function Track (props) {
  const addIcon = <FontAwesomeIcon icon={faPlus} />
  return (
    <div className="Track">
      <h4>{props.track}</h4>
      <button className="button">{addIcon}</button>
    </div>
  );
}

export default Track;