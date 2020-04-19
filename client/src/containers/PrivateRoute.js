import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';

function PrivateRoute({ component: Component, ...rest }) {
  
  const { authToken } = useAuth();
  const { authUser } = useUser();

  return (
    <Route
      {...rest}
      render={props =>
        (authToken && authUser)
        ? (<Component {...props} />)
        : (<Redirect to="/" />) 
      }
    />
  );
}

export default PrivateRoute;