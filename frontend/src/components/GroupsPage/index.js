import { Link,} from "react-router-dom";
import { getGroupsThunk } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { GroupDisplay } from "./GroupDisplay";
import './GroupPage.css';


const GroupsPage  = () => {
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(getGroupsThunk());
    }, [dispatch])
    const groupList = useSelector(state => Object.values(state.groups));

    return(
        <div className="group-page">
            <h1> Groups in Meetup </h1>
            <div>
                <Link to='/events' id='event-link'> Events </Link>
                <Link to='/groups' id='group-link'> Groups </Link>
            </div>
            <div className="group-list">
                {groupList.map(group => {
                    return(
                        <GroupDisplay group={group} key={group.id}/>
                    )
                })}
            </div>
        </div>
   )
}
export default GroupsPage;
