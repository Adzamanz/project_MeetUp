const ADD_EVENTS = 'groups/ADD_EVENTS';

export const addEvents = (events) => {
    return {
        type: ADD_EVENTS,
        payload: events
    }
}

export const getEventsThunk = () => async dispatch => {
    const response = await fetch('/api/events');
    console.log()
    if(response.ok){
        const details = await response.json();
        dispatch(addEvents(details.Events))
    }
}

export const eventsReducer = (state = {}, action) => {
    let newState = {};
    switch(action.type){
        case ADD_EVENTS:
            newState = {...state};
            action.payload.forEach(event => newState[event.id] = event);
            return newState;
        default:
            return state;
    }
}
