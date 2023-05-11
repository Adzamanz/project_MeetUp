import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsThunk } from "../../store/events";
import { Link, useParams } from "react-router-dom";
import { DeleteEventButton } from "./DeleteEventButton";
import { getGroupsThunk, getGroupById } from "../../store/groups";
import { useState } from "react";
import'./EventDetails.css';

export const EventDetails = (props) => {
    const {events} = props;

    const {id} = useParams();
    const dispatch = useDispatch();

    const [group, setGroup] = useState({})

    const event = useSelector(state => state.events[id]);
    const grabGroup = async () => {
        const response = await fetch(`/api/groups/${event.groupId}`);
        if(response.ok){
            const details = await response.json();
            setGroup(details)
        }
    }
    useEffect(() => {
        dispatch(getGroupById(event.groupId));
        grabGroup();
    }, [dispatch]);


    const MiniEventDetails = () => {
        return(
            <div>
                <div>
                    description: {event && event.description}
                </div>
            </div>
        )
    }
    return(
        <div id='eventfull'>
            <div id='eventheader'>
                <div id='eventlink'>
                    <Link to='/events'>Events</Link>
                </div>
                <div id='eventname'>
                {event && event.name}
                </div>
                <div id='eventhost'>

                </div>
            </div>


            <div id='eventmain'>
                <div id='eventimage'>
                    {event?.EventImages?.length ? <img src={event?.EventImages[0].url} /> : <div id='eventnoimage'> no image </div>}
                </div>
                <div id='eventdetails'>
                    <div id='groupdetails'>

                    </div>
                    <div id='eventdetailsa'>
                        <div id='detaila'>
                            <div>start:{event.startDate}</div>
                            <div>end: {event.endDate}</div>
                        </div>
                        <div id='detailb'>
                            {event.price ? '$' + event.price : 'FREE'}
                        </div>
                        <div id='detailc'>
                            {event.type}
                        </div>
                        <DeleteEventButton event={event} group={group} />
                    </div>
                </div>
            </div>
            <div id='eventdetailsb'>
                <MiniEventDetails />
            </div>
        </div>


    )
}
