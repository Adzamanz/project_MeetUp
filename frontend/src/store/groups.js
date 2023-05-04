import {csrfFetch} from './csrf';
const GET_GROUPS = 'groups/GET_GROUPS';
const ADD_GROUP = 'groups/ADD_GROUP';
const DELETE_GROUP = 'groups/DELETE_GROUP'

export const getGroupById = (id) => async dispatch => {
    const response = await fetch(`/api/groups/${id}`);
    if(response.ok){
        const details = await response.json();
        //console.log(details)
        dispatch(addGroup(details))
    }
}
export const getGroups = (groups) => {
    console.log("GETGROUPS",groups)
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

export const deleteGroup = (id) => {
    return {
        type: DELETE_GROUP,
        payload: id
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

export const deleteGroupThunk = (group) => async dispatch => {
    const response = await fetch(`/api/groups/${group.id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(group)
    })
    if(response.ok) {
        const details = await response.json();
        dispatch(deleteGroup(group))
    }
}

export const groupsReducer = (state = {}, action) => {
    let newState = {};
    switch(action.type){
        case DELETE_GROUP:
            newState = {...state};
            delete newState[action.payload.id];
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
            // console.log('flag',action.payload);
            action.payload.forEach(group => {
                newState[group.id] = group;
            });
            return newState;
        default:
            return state;
    }
}
