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

            <div className='main' onClick={() => history.push(`/groups/${group.id}`)}>
                {group.previewImage && <div className="img"> <img  src={`${group.previewImage}`}/> </div>}
                <div className="sub">
                    <div className="name">
                    name: {group.name}
                    </div>
                    <div className="description">
                        description: {group.about}
                    </div>
                    <div className="location">
                        location: {group.city}, {group.state}
                    </div>
                    <div className="details">
                    event#: {events.length}
                    ·
                    {group.private ? 'private' : 'public'}

                </div>
                </div>


            </div>
    )
}
