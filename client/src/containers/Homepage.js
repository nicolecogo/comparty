import React, { useState } from 'react';
import ServerClient from '../services/ServerClient';
import { useAuth } from '../context/auth';
import { Redirect } from 'react-router-dom';

function Homepage () {

  const [ isJoiningParty, setJoiningParty ] = useState(false);
  const [ notFoundMessage, setNotFoundMessage ] = useState(false);
  const [ partyCode, setPartyCode ] = useState('');

  const { authToken } =  useAuth();

  function showCodeInput () {
    setJoiningParty(true);
  }

  function joinParty () {
    //TODO check if party code is correct (ask server)
    // const playlistId = ServerClient.findParty(partyCode);
    // if (playlistId)
    if (partyCode === process.env.REACT_APP_PARTYCODE) {
      localStorage.setItem('partyCode', partyCode);
      loginPage();
    } else setNotFoundMessage(true);
  }

  function createParty () {
    //TODO authorize user and redirect back to user page
    //TODO check if user has a party already or create it (fetch from server)
    //TODO    return spotify playlistId associated with it (store playlistId)
    //TODO    otherwise, create a new spotify playlist and retrieve it (store playlistId)
    loginPage();
  }

  function loginPage () {
    window.location.href = ServerClient._LOGIN_URL;
  }

  return (
    <div className="Homepage">
      <div className="homepage-main">
        <div className="description">
          <h1>Comparty</h1>
          <h2>Start listening to songs together with your friends now!</h2>
        </div>
        <div className="login">
          <button onClick={() => createParty()}>Create a party</button>
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
          notFoundMessage
          ? (
            <div>
              <h3>Party not found.</h3>
              <h4>Are you sure you have entered the correct code?</h4>
              <h4>
                Alternatively, you can go back to your previous party by 
                <span className="link" onClick={ createParty }> logging in here</span>.
              </h4>
            </div>
          )
          : (
            <h4>
              You can go back to your party by clicking on <br/>
              <span className="link" onClick={ createParty }>Create Party</span> or by 
              <span className="link" onClick={ createParty }> logging in here</span>.
            </h4>
          )
        }
      </div>
    </div>
  );
}

export default Homepage;