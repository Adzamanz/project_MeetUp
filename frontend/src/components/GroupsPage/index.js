import { Link, useParams } from "react-router-dom";
import { getGroupsThunk } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ItemDisplay } from "./ItemDisplay";
import './GroupPage.css';


const GroupsPage  = () => {
    const dispatch = useDispatch()
    useEffect(() => {
       dispatch(getGroupsThunk());
    }, [dispatch])
    const groupList = useSelector(state => Object.values(state.groups));
    const {id} = useParams();


    return(
        <div>
            <h1> Groups Page </h1>
            <div>
                <Link to='/events'> Events </Link>
                <Link to='/groups'> Groups </Link>
            </div>
            <div className="group-list">
                {groupList.map(group => {
                    return(
                        <ItemDisplay group={group}/>
                    )
                })}
            </div>
        </div>
   )
}
export default GroupsPage;
