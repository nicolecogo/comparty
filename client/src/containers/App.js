import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from '../containers/PrivateRoute';
import HomePage from './Homepage';
import UserPage from './UserPage';
import Login from './Login';
import { AuthContext } from '../context/auth';
import '../styles/App.css';

function App() {

  const token = localStorage.getItem('token');
  const [authToken, setAuthToken] = useState(token);

  return (
    <div className="Container">
      <AuthContext.Provider value={ {authToken, setAuthToken} }>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage}/>
            <Route exact path="/login" component={Login}/>
            <PrivateRoute path="/user" component={UserPage}/>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
