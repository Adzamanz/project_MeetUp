import { useDispatch,} from "react-redux";
import { useHistory } from "react-router-dom";
import { getEventsByGroupId, getEventsThunk } from "../../store/events";
import { useEffect, useState } from "react";

export const GroupDisplay = (props) => {
    const {group, events} = props;
    // console.log('fllaaaaaaaaaag',events)
    const dispatch = useDispatch();
    const history = useHistory();

    // useEffect(() => {
    //     dispatch(getEventsThunk());
    //     dispatch(getEventsByGroupId(group.id));
    // }, [dispatch])

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
                    event#: {events.length}
                </div>
            </div>
    )
}
