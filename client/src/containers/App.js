import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from '../containers/PrivateRoute';
import HomePage from './Homepage';
import UserPage from './UserPage';
import Login from './Login';
import Join from './Join';
import { AuthContext } from '../context/auth';
import { UserContext } from '../context/user';
import '../styles/App.css';

function App() {

  //upon initialization, check to see if there is a stored user state (keep session)
  const token = localStorage.getItem('token');
  const [authToken, setAuthToken] = useState(token);
  const userId = localStorage.getItem('user');
  const playlistId = localStorage.getItem('playlistId');
  const displayName = localStorage.getItem('displayName');
  const [authUser, setAuthUser] = useState(
    { userId, displayName,
      playlist: { playlistId: playlistId, snapshotId: null, songs: [] },
      player: { ready: false, deviceId: null, player: null, status: { progress: 0, playing: false, currentTrack: null } }
    });

  return (
    <div className="Container">
      <AuthContext.Provider value={ {authToken, setAuthToken} }>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage}/>
            <UserContext.Provider value={ {authUser, setAuthUser} }>
              <Route path="/login" component={Login}/>
              <Route path="/join" component={Join}/>
              <PrivateRoute path="/user" component={UserPage}/>
            </UserContext.Provider>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
