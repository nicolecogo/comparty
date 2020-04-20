import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { usePlaylist } from '../context/playlist';

function SearchItem ({ result, resetSearch }) {

  const { changePlaylist } = usePlaylist();

  function add (item) {
    changePlaylist({ action: 'add', track: item });
    resetSearch();
  }

  const plusIcon = <FontAwesomeIcon icon={faPlus} />
  return (
    <div className="SearchItem">
      <div>
        <h4>{ result.name }</h4>
        <h4>{ result.artists }</h4>
      </div>
      <button className="add-button" onClick={() => add(result)}>{plusIcon}</button>
    </div>
  );
}

export default SearchItem;