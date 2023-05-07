import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux";
import { deleteGroupThunk } from "../../store/groups";
export const CreateEventButton = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {user, group} = props;
    if(user?.id === group.organizerId){
        return(
            <div>
                 <button onClick={() => history.push(`/groups/${group.id}/events/new`)}> create new event</button>
            <button onClick={() => {
                dispatch(deleteGroupThunk(group));
                history.push('/groups');
            }}>DELETE</button>
            <button onClick={() => {
                history.push(`/groups/${group.id}/edit`);
            }}>EDIT</button>
            </div>

        )
    }
}
