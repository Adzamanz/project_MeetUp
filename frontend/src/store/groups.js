const GET_GROUPS = 'groups/GET_GROUPS';

export const addGroups = (groups) => {
    return {
        type: GET_GROUPS,
        payload: groups
    }
}

export const getGroupsThunk = () => async dispatch => {
    const response = await fetch('/api/groups');

    if(response.ok){
        const details = await response.json();
        dispatch(addGroups(details.Groups))
    }
}

export const groupsReducer = (state = {}, action) => {
    let newState = {};
    switch(action.type){
        case GET_GROUPS:
            newState = {...state};
            action.payload.forEach(group => newState[group.id] = group);
            return newState;
        default:
            return state;
    }
}
