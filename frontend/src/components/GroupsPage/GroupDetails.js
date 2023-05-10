import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupsThunk, getGroupById } from "../../store/groups";
import { useEffect,} from "react";
import { CreateEventButton } from "./CreateEventButton";
import './GroupDetails.css';


export const GroupDetails = () => {
    const {id} = useParams();
    const dispatch = useDispatch();

    const getOrganizer = async (id) => {
       // const organizer = await
    }



    const groups = useSelector(state => state.groups);
    const group = useSelector(state => state.groups[id]);
    console.log(groups);
    const events = useSelector(state => Object.values(state.events).filter((event) => {
        if(event.id === group.id) return true;
        else return false;
    }))
    const user = useSelector(state => state.session.user);
    useEffect(() => {
            dispatch(getGroupById(id))
            console.log(group.previewImage)
        }, [dispatch])

    const GroupEventDetails = () => {
        return(
            <div>
                <div>
                    What we're about
                    {group.about}
                </div>
                <div>

                </div>
            </div>
        )
    }

    const MiniGroupDetails = () => {
        return(
            <div>
                <div id='name'>
                    name: {group && group.name}
                </div>
                <div id='city'>
                    location: {group && group.city}, {group && group.state}
                </div>
                <div>
                    {events && events.length} {group.private ? 'Private' : 'Public'}
                </div>
                <div id='organizer'>
                    Organized by
                </div>
            </div>
        )
    }

    return(
        <div>
            <h1> group details page </h1>
            <div>
                {group && <div>
                    {group.previewImage && <div id='image'> <img src={`${group.previewImage}`}/> </div>}
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
