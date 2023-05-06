import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { deleteEventThunk } from "../../store/events";
export const DeleteEventButton = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {event, group} = props;
    const user = useSelector(state => state.session.user);
    if(user.id === group.organizerId){
        return(
            <div>
            <button onClick={() => {
                dispatch(deleteEventThunk(event));
                history.push('/groups');
            }}>DELETE</button>
            </div>

        )
    }
}
