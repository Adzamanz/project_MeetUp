import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupById } from "../../store/groups";

export const GroupDetails = () => {
    const dispatch = useDispatch()
    const {id} = useParams();
    const group = useSelector(getGroupById(id));

    return(

        <div>
            <h1> group details page </h1>
            <div>
                {group}
            </div>
        </div>

    )
};
