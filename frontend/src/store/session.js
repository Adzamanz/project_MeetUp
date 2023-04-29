import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data));
  return response;
};

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data));
    return response;
};

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;


// import {csrfFetch} from './csrf';


// const LOG_IN = 'session/LOG_IN';
// const LOG_OUT = 'session/LOG_OUT';



// export const logInUser = (input) => {
//     return {
//         type: LOG_IN,
//         payload: input
//     }
// }
// export const logOutUser = () => {
//     return {
//         type: LOG_OUT,
//     }
// }

// export const parseLogIn = ({credential, password}) => async (dispatch) => {
//     //async fetch to backend

//     //verify response
//     //return action based on res.ok

//     const response = await csrfFetch('/api/session',{
//         method: 'POST',
//         body: JSON.stringify({
//             credential,
//             password
//         })
//     })
//     if(response.ok){
//         const data = await response.json();
//         console.log("AAA", data)
//         dispatch(logInUser(data));
//         return response;
//     }else throw response

// }

// export const sessionReducer = (state = {}, action) => {
//     let newState;
//     switch(action.type){
//         case LOG_OUT:
//             newState = {...state};
//             newState.user = null;
//             return newState;
//         case LOG_IN:
//             newState = {...state}
//             newState.user = action.payload;
//             return newState;
//         default:
//             return state;
//     }
// }
