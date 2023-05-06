import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { getEventsByGroupId, getEventsThunk } from "../../store/events";
import { useEffect } from "react";
export const GroupDisplay = (props) => {
    let group = props.group;
    const dispatch = useDispatch()
    const history = useHistory();

    const eventList = useSelector(state => state.events)
    const grabEvents = () => {
        Object.values(eventList).map(event => {
            if(event.groupId == group.id) return event;
        })
    }
    let eventCount;

    useEffect(() => {
        dispatch(getEventsThunk());
        dispatch(getEventsByGroupId(group.id));
        eventCount = grabEvents();
    }, [dispatch])
    console.log(eventCount)



    // console.log(eventCount)
    return(

            <div onClick={() => history.push(`/groups/${group.id}`)}>
                <div>
                    name: {group.name}
                </div>
                <div>
                    description: {group.about}
                </div>
                <div>
                    location: {group.city}, {group.state}
                </div>
                <div>
                    private: {group.private ? 'true' : 'false'}
                </div>
                <div>
                    event#: {eventCount}
                </div>
            </div>
    )
}
