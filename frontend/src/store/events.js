import { useParams } from "react-router-dom";
import { csrfFetch } from "./csrf";

const ADD_EVENTS = 'events/ADD_EVENTS';
const DELETE_EVENT = 'events/DELETE_EVENT'

export const addEvents = (events) => {
    return {
        type: ADD_EVENTS,
        payload: events
    }
}
export const deleteEvent = (event) => {
    return {
        type: DELETE_EVENTS,
        payload: event
    }
}
export const deleteEventThunk = (event) => async dispatch => {
    const response = await fetch(`/api/events/${event.id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    if(response.ok) {
        const details = await response.json();
        dispatch(deleteGroup(details))
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
export const createEventThunk = (event) => async dispatch => {
    const {id} = useParams();
    const response = csrfFetch(`/groups/${id}/events/`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    if(response.ok){
        const details = await response.json();
        dispatch(addEvent(details));
        return details;

    }
}

export const eventsReducer = (state = {}, action) => {
    let newState = {};
    switch(action.type){
        case DELETE_EVENT:
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
        default:
            return state;
    }
}
