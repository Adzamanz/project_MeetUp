import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupById, getGroupsThunk } from "../../store/groups";
import { useEffect } from "react";

export const GroupDetails = () => {

    const {id} = useParams();
    const dispatch = useDispatch();
    const groups = useSelector((state) => Object.values(state.groups))
    let group;
    groups.map(groupA => {
        group = groupA
    })

    useEffect(() => {
        dispatch(getGroupsThunk())
        //console.log('deeets',group)
    }, [id, dispatch])

    const GroupDetails = () => {
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
                <GroupDetails />
            </div>


        </div>


    )
};
