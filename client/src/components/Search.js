import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


function SearchBar () {
  const searchIcon = <FontAwesomeIcon icon={faSearch} />
  return (
    <div className="Search">
      <button className="button">{searchIcon}</button>
    </div>
  );
}

export default SearchBar;