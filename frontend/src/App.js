import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Greeting from "./components/Greeting";
import GroupsPage from "./components/GroupsPage";
import EventsPage from "./components/EventsPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>

        <Route path='/groups'>
          <GroupsPage />
        </Route>
        <Route path='/events'>
          <EventsPage />
        </Route>
        <Route path='/'>
          <Greeting/>
        </Route>

        </Switch>
      }
    </>
  );
}

export default App;
