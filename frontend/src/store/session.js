
import {csrfFetch} from './csrf';


const LOG_IN = 'session/LOG_IN';
const LOG_OUT = 'session/LOG_OUT';



export const logInUser = (input) => {
    return {
        type: LOG_IN,
        payload: input
    }
}
export const logOutUser = () => {
    return {
        type: LOG_OUT,
    }
}

export const parseLogIn = ({credential, password}) => async (dispatch) => {
    //async fetch to backend

    //verify response
    //return action based on res.ok

    const response = await csrfFetch('/api/session',{
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        })
    })
    if(response.ok){
        const data = await response.json();
        console.log("AAA", data)
        dispatch(logInUser(data));
        return response;
    }else throw response

}

export const sessionReducer = (state = {}, action) => {
    let newState;
    switch(action.type){
        case LOG_OUT:
            newState = {...state};
            newState.user = null;
            return newState;
        case LOG_IN:
            newState = {...state}
            newState.user = action.payload;
            return newState;
        default:
            return state;
    }
}
