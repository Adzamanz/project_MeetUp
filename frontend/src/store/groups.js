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

        dispatch(addGroup(details))
        return details;
    }
}

//update group thunk
export const updateGroupThunk = (event) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${event.id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });
    if(response.ok) {
        const details = await response.json();

        dispatch(addGroup(details))
        return details;
    }
}

export const deleteGroupThunk = (group) => async dispatch => {
    const groupEvents = dispatch(getEventsByGroupId())
    const response = await csrfFetch(`/api/groups/${group.id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(group)
    })
    if(response.ok) {
        const details = await response.json();

        //idk what lines 93 to 97 are here for
        //todo: check event and dispatch for successful run
        // groupEvents.forEach((event) => {

        //     dispatch(deleteEventThunk(event))
        // })
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
            if (!state[action.payload.id]) {
                newState = {
                    ...state,
                    [action.payload.id]: action.payload
                };
                return newState;
            }
            return {
                ...state,
                [action.payload.id]: {
                  ...state[action.payload.id],
                  ...action.payload
                }
              };
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
