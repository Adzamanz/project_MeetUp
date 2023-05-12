import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { deleteEventThunk } from "../../store/events";
import { DeleteItemModal } from "../DeleteItemModal/index";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
export const DeleteEventButton = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {event, group} = props;
    const user = useSelector(state => state.session.user);
    if(user && user.id === group.organizerId){
        return(
            <div>
            <OpenModalMenuItem
                itemText="Delete"
                modalComponent={<DeleteItemModal action={deleteEventThunk} target={event} landing='/events'/>}
              />
            <button onClick={() => alert('feature coming soon')}> Update </button>
            </div>

        )
    }
}
