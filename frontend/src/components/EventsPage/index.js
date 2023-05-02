import { Link } from "react-router-dom";
import { getEventsThunk } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ItemDisplay } from "./ItemDisplay";
import './EventsPage.css';

const EventsPage  = () => {
    const dispatch = useDispatch()
    useEffect(() => {
       dispatch(getEventsThunk());
    }, [dispatch])
    const eventList = useSelector(state => Object.values(state.events));
    return(
        <div>
            <h1> Events Page </h1>
            <div>
                <Link to='/events'> Events </Link>
                <Link to='/groups'> Groups </Link>
            </div>
            <div className="event-list">
                {eventList.map(event => {
                    return(
                        <ItemDisplay event={event}/>
                    )
                })}
            </div>
        </div>

    )
}
export default EventsPage;
