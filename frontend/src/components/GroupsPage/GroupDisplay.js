import { useDispatch,} from "react-redux";
import { useHistory } from "react-router-dom";
import { getEventsByGroupId, getEventsThunk } from "../../store/events";
import { useEffect, useState } from "react";

export const GroupDisplay = (props) => {
    const {group, events} = props;
    // console.log('fllaaaaaaaaaag',events)
    const dispatch = useDispatch();
    const history = useHistory();

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
                    event#: {events.length}
                    ·
                    {group.private ? 'private' : 'public'}

                </div>
                <div>
                </div>
                <div>

                </div>
            </div>
    )
}
