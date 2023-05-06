import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, useParams } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Greeting from "./components/Greeting";
import GroupsPage from "./components/GroupsPage";
import EventsPage from "./components/EventsPage";
import { GroupDetails } from "./components/GroupsPage/GroupDetails"
import { CreateGroup } from "./components/CreateGroup";
import { EventDetails } from "./components/EventsPage/EventDetails";
import { CreateEvent } from "./components/CreateEvent/index";
import { getEventsThunk } from "./store/events";
import {EditGroup} from './components/GroupsPage/UpdateGroup'
import { getGroupsThunk } from "./store/groups";

function App() {
  const dispatch = useDispatch();

  const user = useSelector(state => state.session);
  let events = useSelector(state => state.events);
  const {id} = useParams();

  console.log(events)

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getEventsThunk());
    dispatch(getGroupsThunk());
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
        <Route path='/groups/:id/events/new'>
          <CreateEvent />
        </Route>
        <Route exact path='/groups/:id/edit'>
        <EditGroup />
        </Route>
        <Route path='/groups/:id'>
          <GroupDetails />
        </Route>
        <Route path='/groups'>
          <GroupsPage />
        </Route>
        <Route path='/events/:id'>
          <EventDetails/>
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
