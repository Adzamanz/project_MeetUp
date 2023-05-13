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
    document.title = `${event?.name}`;
    const grabGroup = async () => {
        const response = await fetch(`/api/groups/${event?.groupId}`);
        if(response.ok){
            const details = await response.json();
            setGroup(details)
        }
    }
    useEffect(() => {
        dispatch(getGroupById(event?.groupId));
        grabGroup();
    }, [dispatch]);


    const MiniEventDetails = () => {
        return(
            <div id='about'>
                <div>
                    Details
                </div>
                <p>
                    {event && event.description}
                </p>
            </div>
        )
    }
    return(
        <div>
        {event && <div id='eventfull'>
            <div id='eventheader'>
                <div id='innerheader'>
                    <div id='eventlink'>
                    <Link to='/events'>Events</Link>
                    </div>
                    <div id='eventname'>
                        {event && event.name}
                    </div>
                    <div id='eventhost'>
                        Hosted by {group?.Organizer?.firstName} {group?.Organizer?.lastName}
                    </div>
                </div>

            </div>


            <div id='eventmain'>
                <div id='eventimage'>
                    {event?.EventImages?.length ? <img src={event?.EventImages[0].url} /> : <div id='eventnoimage'> no image </div>}
                </div>
                <div id='eventdetails'>
                    <div id='groupdetails'>
                        <div id='grpimg'>
                           { group.previewImage ? <img src={group.previewImage} /> : <div> no image </div> }
                        </div>
                        <div id='grpname'>
                            {group.name}
                        </div>
                        <div id='grpprivate'>
                            {group.private ? 'Private' : 'Public'}
                        </div>
                    </div>
                    <div id='eventdetailsa'>
                        <div id='detaila'>
                        <i className="fas fa-regular fa-clock" id='clock'></i>
                            <div>start : {event?.startDate?.split('T').join('·').slice(0, -8)}</div>
                            <div>end : {event?.endDate?.split('T').join('·').slice(0, -8)}</div>
                        </div>
                        <div id='detailb'>
                            <i className="fas fa-solid fa-dollar-sign"></i>
                            <div id='cost'>{event.price ? '$' + event.price : 'FREE'}</div>
                        </div>
                        <div id='detailc'>
                            <i className="fas fa-solid fa-map-pin"></i>
                            {event.type}
                        </div>
                        <div id='DEbutton'>
                        <DeleteEventButton event={event} group={group} />

                        </div>

                    </div>
                </div>
            </div>
            <div id='eventdetailsb'>
                <MiniEventDetails />
            </div>
        </div>
        }
        </div>

    )
}
