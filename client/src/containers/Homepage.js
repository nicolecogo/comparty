import React from 'react';
import ServerClient from '../services/ServerClient';

function Homepage () {
  return (
    <div className="Homepage">
      <a href={ServerClient._LOGIN_URL}>Login</a>
    </div>
  );
}

export default Homepage;