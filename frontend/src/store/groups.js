const GET_GROUPS = 'groups/GET_GROUPS';
const ADD_GROUP = 'groups/ADD_GROUP';
const DELETE_GROUP = 'groups/DELETE_GROUP'
export const getGroupById = (id) => async dispatch => {
    const response = await fetch(`/api/groups/${id}`);
    if(response.ok){
        const details = await response.json();
        console.log(details)
        return details;
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

//update group thunk

//delete group thunk

export const groupsReducer = (state = {}, action) => {
    let newState = {};
    switch(action.type){
        case ADD_GROUP:
            if (!state[action.pokemon.id]) {
                const newState = {
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
            action.payload.forEach(group => newState[group.id] = group);
            return newState;
        default:
            return state;
    }
}
