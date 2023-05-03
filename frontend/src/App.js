import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Greeting from "./components/Greeting";
import GroupsPage from "./components/GroupsPage";
import EventsPage from "./components/EventsPage";
import { GroupDetails } from "./components/GroupsPage/GroupDetails"
import { CreateGroup } from "./components/CreateGroup";
import { EventDetails } from "./components/EventsPage/EventDetails";

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

        <Route exact path='/groups/new'>
          <CreateGroup />
        </Route>
        <Route path='/groups/:id'>
          <GroupDetails />
        </Route>
        <Route path='/groups'>
          <GroupsPage />
        </Route>
        <Route path='/events/:id'>
          <EventDetails />
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
