import { Link } from "react-router-dom";
import { getEventsThunk } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { EventDisplay } from "./EventDisplay";
import './EventsPage.css';

const EventsPage  = () => {
    const dispatch = useDispatch()
    useEffect(() => {
       dispatch(getEventsThunk());
    }, [dispatch])
    const eventList = useSelector(state => Object.values(state.events));
    return(
        <div className="events-page">
            <h1> Events Page </h1>
            <div>
                <Link to='/events'> Events </Link>
                <Link to='/groups'> Groups </Link>
            </div>
            <div className="event-list">
                {eventList.map(event => {
                    return(
                        <EventDisplay event={event} key={event.id}/>
                    )
                })}
            </div>
        </div>

    )
}
export default EventsPage;
