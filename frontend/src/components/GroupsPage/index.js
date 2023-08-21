
import { Link,} from "react-router-dom";
import { getGroupsThunk } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { GroupDisplay } from "./GroupDisplay";
import './GroupPage.css';
import { getEventsThunk } from "../../store/events";


const GroupsPage  = () => {
    const dispatch = useDispatch()
    document.title = `Groups Page`;
    const groupList = useSelector(state => Object.values(state.groups));
    const eventList = useSelector(state => Object.values(state.events));


    return(
        <div className="group-page">
            <h1> Groups in Meetup </h1>
            <div>
                <Link to='/events' id='event-link'> Events </Link>
                <Link to='/groups' id='group-link'> Groups </Link>
            </div>
            <div className="group-list">
                {groupList.map(group => {
                    const groupEvents = eventList.filter(event => event.groupId === group.id);
                    return(
                        <GroupDisplay group={group} events={groupEvents} key={group.id}/>
                    )
                })}
            </div>
        </div>
   )
}
export default GroupsPage;
