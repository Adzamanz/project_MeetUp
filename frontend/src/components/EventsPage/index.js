import { Link } from "react-router-dom";
import { getEventsThunk } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { EventDisplay } from "./EventDisplay";
import './EventsPage.css';

const EventsPage  = () => {
    const dispatch = useDispatch()
    const eventList = useSelector(state => Object.values(state.events));
    document.title = `Events Page`;
    function compareFn(a, b) {
        if (a.startDate < b.startDate) {
          return -1;
        }
        if (a.startDate > b.startDate) {
          return 1;
        }
        // a must be equal to b
        return 0;
      }


    const Thing = () =>{
        return (
            <div className="events-page">
                <h1> Events in Meetup </h1>
                <div>
                    <Link to='/events' id='events'> Events </Link>
                    <Link to='/groups' id='groups'> Groups </Link>
                </div>
                <div className="event-list">
                    {eventList && eventList.sort(compareFn).map(event => {
                        return(
                            <EventDisplay event={event} key={event.id}/>
                        )
                    })}
                </div>
            </div>
        )
    }

    return(
        <div className="events-page-container">
            {eventList && <Thing />}
        </div>

    )
}
export default EventsPage;
