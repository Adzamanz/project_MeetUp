import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupsThunk } from "../../store/groups";
import { useEffect } from "react";

export const GroupDetails = () => {

    const {id} = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups[id])


    useEffect(() => {
        dispatch(getGroupsThunk())
        //console.log('deeets',group)
    }, [id, dispatch])

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


        </div>


    )
};
