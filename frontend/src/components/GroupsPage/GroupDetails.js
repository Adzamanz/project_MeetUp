import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupsThunk, getGroupById } from "../../store/groups";
import { useEffect, useState,} from "react";
import { CreateEventButton } from "./CreateEventButton";
import { Link } from "react-router-dom";
import {EventDisplay} from '../EventsPage/EventDisplay'
import './GroupDetails.css';


export const GroupDetails = (props) => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const groups = useSelector(state => state.groups);
    const group = useSelector(state => state.groups[id]);
    const groupImg = useSelector(state => state.groups[id]?.previewImage);
    const groupOrg = useSelector(state => state.groups[id]?.Organizer?.firstName + ' ' + state.groups[id]?.Organizer?.lastName)
    const groupOrgName = useSelector(state => state.groups[id]?.organizerName);
    document.title = `${group?.name}`;
    console.log(groups);
    const events = useSelector(state => Object.values(state.events).filter((event) => {
        if(event.groupId === group?.id) return true;
        else return false;
    }))
    const user = useSelector(state => state.session.user);
    useEffect(() => {
        dispatch(getGroupById(id))
    }, [dispatch,])

    function compareFn(a, b) {
        if (a.startDate < b.startDate) {
            return -1;
        }
        if (a.startDate > b.startDate) {
            return 1;
        }
        // a must be equal to b
        return 0;
        }

    const GroupEventDetails = () => {
        return(
            <div id='eventinfo'>
                <div id='a'>
                    Organizer
                    <div id='aa'>
                        {groupOrgName || groupOrg}
                    </div>
                </div>
                <div id='b'>
                    What we're about
                    <div id='about'>
                        {group?.about}
                    </div>
                </div>
                <div id='c'>
                    Events ({events.length})
                    {events.sort(compareFn).map(event => {
                        return <EventDisplay key={event.id} event={event} />
                    })}
                </div>
            </div>
        )
    }

    const MiniGroupDetails = () => {
        return(
            <div id='minidetails'>
                <div id='name'>
                    {group && group.name}
                </div>
                <div id='city'>
                    {group && group.city}, {group && group.state}
                </div>
                <div>
                    {events && events.length} · {group.private ? 'Private' : 'Public'}
                </div>
                <div id='organizer'>
                    Organized by {groupOrgName || groupOrg}
                </div>
            </div>
        )
    }

    return(
        <>
        {group &&
         <div>
            <div id='main'>
                <Link to='/groups'> Groups </Link>
                {group && <div id='sub-a'>
                    <div id='image'> {group.previewImage ? <img src={`${groupImg}`}/> : <img src={`${group.GroupImages?.url}`}/>} </div>
                    <MiniGroupDetails />
                    <div id='button'>
                        <CreateEventButton user={user} group={group}/>
                        {user && user.id !== group?.organizerId && <button onClick={() => alert('feature coming soon')}>Join Group</button>}
                    </div>
                </div>}
            </div>
            <div >
                    <GroupEventDetails />
            </div>
        </div>}
        </>

    )
};
