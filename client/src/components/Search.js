import React, { useState } from 'react';
import { useAuth } from '../context/auth';
import SearchItem from './SearchItem';
import SpotifyClient from '../services/SpotifyClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchBar () {
  
  const { authToken } = useAuth();

  const [ searchKeywords, setSearchKeywords ] = useState('');
  const [ searchResult, setSearchResult ] = useState([]);

  function search (e) {
    e.preventDefault();
  }

  function handleChange (e) {
    setSearchKeywords(e.target.value);
    if(searchKeywords) {
      SpotifyClient.findSong(authToken, searchKeywords)
        .then(res => setSearchResult(res));
    }
  }

  function cleanResults () {
    setSearchResult([]);
    setSearchKeywords('');
  }

  const searchIcon = <FontAwesomeIcon icon={faSearch} />
  return (
    <div className="Search" onMouseLeave={cleanResults}>
      <form onSubmit={search}>
        <input className="input" type="text" placeholder="search songs"
          value={searchKeywords}
          onChange={handleChange}
        />
        <button className="button" type="submit">
          {searchIcon}
        </button>
      </form>
      <div className="SearchResult">
        {searchResult.map(item => (
          <SearchItem key={item.id} result={item} resetSearch={cleanResults}/>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;