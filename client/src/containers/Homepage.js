import React, { useState } from 'react';
import ServerClient from '../services/ServerClient';

function Homepage () {

  const [ isJoiningParty, setJoiningParty ] = useState(false);
  const [ notFoundMessage, setNotFoundMessage ] = useState(false);
  const [ partyCode, setPartyCode ] = useState('');

  function showCodeInput () {
    setJoiningParty(true);
  }

  function joinParty () {
    //TODO check if party code is correct (fetch from server)
    //TODO    if yes, redirect to login page, and back to user page
    if (partyCode === 'abcdef123456') {
      loginPage(partyCode);
    }
    //TODO    if not, show not found message
    setNotFoundMessage(true);
  }

  function loginPage (partyCode) {
    let params = '';
    if(partyCode) params = `?partyCode=${partyCode}`;
    window.location.href = ServerClient._LOGIN_URL + params;
  }

  return (
    <div className="Homepage">
      <div className="homepage-main">
        <div className="description">
          <h1>Comparty</h1>
          <h2>Start listening to songs together with your friends now!</h2>
        </div>
        <div className="login">
          <button onClick={() => loginPage()}>Create a party</button>
          {
            isJoiningParty && partyCode
            ? <button onClick={() => joinParty()}>Join party</button>
            : <button onClick={() => showCodeInput()}>I have a code</button>
          }
          {
            isJoiningParty &&
            <input className="input" type="text" placeholder="Enter party code here"
              value={partyCode}
              onChange={(e) => { setPartyCode(e.target.value) }}
              onKeyPress={(e) => { if (e.key === 'Enter') joinParty() }}
            />
          }
        </div>
        {
          notFoundMessage &&
          (
            <div>
              <h3>Party not found.</h3>
              <h4>Are you sure you have entered the correct code?</h4>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Homepage;