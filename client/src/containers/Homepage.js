import React from 'react';
import ServerClient from '../services/ServerClient';

function Homepage () {
  return (
    <div className="Homepage">
      <div className="homepage-main">
        <div className="description">
          <h1>Comparty</h1>
          <h2>Start listening to songs together with your friends now!</h2>
        </div>
        <div className="login">
          <a href={ServerClient._LOGIN_URL}>Create a party</a>
        </div>
      </div>
    </div>
  );
}

export default Homepage;