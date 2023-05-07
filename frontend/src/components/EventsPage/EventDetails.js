import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEventsThunk } from "../../store/events";
import { useParams } from "react-router-dom";
import { DeleteEventButton } from "./DeleteEventButton";
import { getGroupsThunk, getGroupById } from "../../store/groups";
import { useState } from "react";

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
                    name: {event && event.name}
                </div>
                <div>
                    description: {event && event.description}
                </div>

            </div>

        )
    }
    return(
        <div>
            <h1> event details page </h1>
            <div>
                <MiniEventDetails />
                <DeleteEventButton event={event} group={group} />
            </div>
        </div>


    )
}
