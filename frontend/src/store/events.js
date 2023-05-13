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
export const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        payload: eventId
    }
}
export const deleteEventThunk = (event) => async dispatch => {
    const response = await csrfFetch(`/api/events/${event.id}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    if(response.ok) {
        await dispatch(deleteEvent(event.id))
        return {ok: true}
    }
}

export const getEventById = (id) => async dispatch => {
    const response = fetch(`/api/events/${id}`);
    if(response.ok){
        const details = await response.json();
        // console.log('thunk', details)
        dispatch(addEvent(details));
        return details
    }

}

export const getEventsThunk = () => async dispatch => {
    const response = await fetch('/api/events');

    if(response.ok){
        const details = await response.json();
        console.log(details)
        dispatch(addEvents(details.Events))
    }
}
export const getEventsByGroupId = (id) => async dispatch => {
    const response = await fetch(`/api/groups/${id}/events`);
    if(response.ok){
        const details = await response.json();
        console.log(details.Events)
        dispatch(addEvents(details.Events));
        return details.Events

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
        await csrfFetch(`/api/events/${details.id}/images`,{
            method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: event.imgUrl, preview: true})
        })
        // console.log('thunk', details)
        dispatch(addEvent(details));
        return details
    }
}

export const eventsReducer = (state = {}, action) => {
    let newState = {};
    switch(action.type){
        case DELETE_EVENT:
            newState = {...state};
            delete newState[action.payload];
            return newState;
        case ADD_EVENTS:
            newState = {...state};
            action.payload.forEach(event => {
                newState[event.id] = event
            });
            return newState;
        case ADD_EVENT:
            newState = {...state};
            newState[action.payload.id] = action.payload;
            return newState;
        default:
            return state;
    }
}
