import React from 'react';
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <AuthWrapper>
      <Router>
        <Switch>

          <PrivateRoute exact={true} path="/">
            <Dashboard></Dashboard>
          </PrivateRoute>

          <Route path="/login">
            <Login />
          </Route>
          
          <Route path="*">
            <Error/>
          </Route>
          {/* on  the error page path * means it matches everything else as long as its not indicated check more in README */}
        </Switch>
      </Router>
    </AuthWrapper>
  );
}

export default App;
