import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux";
import { deleteGroupThunk, getGroupsThunk } from "../../store/groups";
import { DeleteItemModal } from "../DeleteItemModal/index";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
export const CreateEventButton = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {user, group} = props;
    if(user?.id === group.organizerId){
        return(
            <div>
                 <button onClick={() => history.push(`/groups/${group.id}/events/new`)}> create new event</button>
                 <OpenModalMenuItem
                itemText="Delete"
                modalComponent={<DeleteItemModal action={deleteGroupThunk} target={group} landing='/groups'/>}
              />
            <button onClick={() => {
                history.push(`/groups/${group.id}/edit`);
            }}>EDIT</button>
            </div>

        )
    }
}
