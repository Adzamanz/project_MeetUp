import {csrfFetch} from './csrf';
import { deleteEvent, deleteEventThunk, getEventsByGroupId, getEventsThunk } from './events';
const GET_GROUPS = 'groups/GET_GROUPS';
const ADD_GROUP = 'groups/ADD_GROUP';
const DELETE_GROUP = 'groups/DELETE_GROUP'

export const getGroupById = (id) => async dispatch => {
    const response = await fetch(`/api/groups/${id}`);
    if(response.ok){
        const details = await response.json();
        await dispatch(addGroup(details))
        return details
    }
}
export const getGroups = (groups) => {
    return {
        type: GET_GROUPS,
        payload: groups
    }
}
export const addGroup = (group) => {
    return {
        type: ADD_GROUP,
        payload: group
    }
}

//update group ????

export const deleteGroup = (details) => {
    return {
        type: DELETE_GROUP,
        payload: details
    }
}
export const getGroupsThunk = () => async dispatch => {
    const response = await fetch('/api/groups');

    if(response.ok){
        const details = await response.json();

        dispatch(getGroups(details.Groups))
    }
}

//create group thunk
export const createGroupThunk = (group) => async dispatch => {
    const response = await csrfFetch('/api/groups',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(group)
    })
    if(response.ok) {
        const details = await response.json();
        await csrfFetch(`/api/groups/${details.id}/images`,{
            method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: group.imgUrl, preview: true})
        })
        dispatch(addGroup(details))
        return details;
    }
}

//update group thunk
export const updateGroupThunk = (group, id) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(group)
    });
    if(response.ok) {
        const details = await response.json();
        await csrfFetch(`/api/groups/${details.id}/images`,{
            method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: group.imgUrl, preview: true})
        })

        dispatch(addGroup(details))
        return details;
    }
}

export const deleteGroupThunk = (group) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${group.id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(group)
    })
    if(response.ok) {
        const details = await response.json();

        dispatch(deleteGroup(group.id))

    }
}

export const groupsReducer = (state = {}, action) => {
    let newState = {};
    switch(action.type){
        case DELETE_GROUP:
            newState = {...state};
            delete newState[action.payload];
            return newState;
        case ADD_GROUP:
            newState = {...state};
            newState[action.payload.id] = action.payload;
            return newState;
        case GET_GROUPS:
            newState = {...state};
            action.payload.forEach(group => {
                newState[group.id] = group;
            });
            return newState;
        default:
            return state;
    }
}
