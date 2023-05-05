import { useParams } from "react-router-dom";
import { csrfFetch } from "./csrf";

const ADD_EVENTS = 'events/ADD_EVENTS';
const ADD_EVENT = 'events/ADD_EVENT';
const DELETE_EVENT = 'events/DELETE_EVENT';

export const addEvents = (events) => {
    return {
        type: ADD_EVENTS,
        payload: events
    }
}
export const addEvent = (event) => {
    return {
        type: ADD_EVENT,
        payload: event
    }
}
export const deleteEvent = (event) => {
    return {
        type: DELETE_EVENT,
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
        dispatch(deleteEvent(details))
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
export const createEventThunk = (event, id) => async dispatch => {
    console.log(id)
    const response = await csrfFetch(`/api/groups/${id}/events`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    console.log('resp ok?',response.ok)
    if(response.ok){
        const details = await response.json();
        console.log('thunk', details)
        dispatch(addEvent(details));
        return details
    }
}

export const eventsReducer = (state = {}, action) => {
    let newState = {};
    switch(action.type){
        case DELETE_EVENT:
            newState = {...state};
            delete newState[action.payload.id];
            return newState;
        case ADD_EVENTS:
            newState = {...state};
            action.payload.forEach(event => newState[event.id] = event);
            return newState;
        case ADD_EVENT:
            newState = {...state};
            newState[action.payload.id] = action.payload;
            return newState;
        default:
            return state;
    }
}
