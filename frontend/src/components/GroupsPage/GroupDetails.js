import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getGroupsThunk } from "../../store/groups";
import { useEffect, useReducer } from "react";

export const GroupDetails = () => {

    const {id} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroupsThunk())
        //console.log('deeets',group)
    }, [id, dispatch])
    const group = useSelector(state => state.groups[id]);
    const user = useSelector(state => state.session.user)
    const history = useHistory();





    const MiniGroupDetails = () => {
        return(
            <div>
                <div>
                    name: {group && group.name}
                </div>
                <div>
                    city: {group && group.city}
                </div>
                <div>
                    state: {group && group.state}
                </div>
            </div>

        )
    }
    return(
        <div>
            <h1> group details page </h1>
            <div>
                <MiniGroupDetails />
            </div>
            <div>
                {user.id == group.organizerId && <button onClick={() => history.push(`/groups/${group.id}/events/new`)}> create new event</button>}
            </div>
        </div>
    )
};
