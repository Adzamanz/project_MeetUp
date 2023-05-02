import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const GroupDetails = (props) => {
    const {id} = useParams;
    const group = useSelector(state => state.groups[id])
    return(
        <div>
            <h1> group details page </h1>
            {group}
        </div>


    )
};
