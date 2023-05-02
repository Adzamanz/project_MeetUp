const GET_GROUPS = 'groups/GET_GROUPS';
const CREATE_GROUP = 'groups/CREATE_GROUP';
const DELETE_GROUP = 'groups/DELETE_GROUP'
export const getGroupById = (id) => async dispatch => {
    const response = await fetch(`/api/groups/${id}`);
    if(response.ok){
        const details = await response.json();
        return details;
    }
}
export const getGroups = (groups) => {
    return {
        type: GET_GROUPS,
        payload: groups
    }
}
export const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
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
        // case CREATE_GROUP:
        //     if (!state[action.pokemon.id]) {
        //         const newState = {
        //             ...state,
        //             [action.payload.id]: action.payload
        //         };
        //         // const groupsList = newState.list.map(id => newState[id]);
        //         // groupsList.push(action.payload);
        //         // newState.list = sortList(groupsList);
        //         return newState;
        //     }
        //     return {
        //         ...state,
        //         [action.payload.id]: {
        //           ...state[action.payload.id],
        //           ...action.payload
        //         }
        //       };
        case GET_GROUPS:
            newState = {...state};
            action.payload.forEach(group => newState[group.id] = group);
            return newState;
        default:
            return state;
    }
}
