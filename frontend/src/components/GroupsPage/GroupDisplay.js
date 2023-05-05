import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { getEventsByGroupId } from "../../store/events";
import { useEffect } from "react";
export const GroupDisplay = (props) => {
    let group = props.group;
    const dispatch = useDispatch()
    const history = useHistory();
    let eventCount;
     
        // eventCount = dispatch(getEventsByGroupId(group.id));


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
                    {/* event#: {eventCount} */}
                </div>
            </div>
    )
}
