import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupById } from "../../store/groups";
import { useEffect } from "react";

export const GroupDetails = (props) => {
    const {id} = useParams();
    return(
        <div>
            <h1> group details page </h1>

        </div>


    )
};
