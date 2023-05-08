import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupsThunk, getGroupById } from "../../store/groups";
import { useEffect,} from "react";
import { CreateEventButton } from "./CreateEventButton";


export const GroupDetails = () => {
    const {id} = useParams();
    const dispatch = useDispatch();

    const groups = useSelector(state => state.groups);
    const group = useSelector(state => state.groups[id]);
    console.log(groups);
    const user = useSelector(state => state.session.user);
    useEffect(() => {
            dispatch(getGroupById(id))
            console.log(group.previewImage)
        }, [dispatch])

    const MiniGroupDetails = () => {
        return(
            <div>
                    {group.previewImage && <img src={`${group.previewImage}`}/>}
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
                {group && <div>
                    <div>
                        <MiniGroupDetails />
                    </div>
                    <div>
                        <CreateEventButton user={user} group={group}/>
                     </div>
                </div>}
            </div>
        </div>
    )
};
