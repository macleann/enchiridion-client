export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';
export const SET_USER_DATA = 'SET_USER_DATA';

export const setLoggedIn = (isLoggedIn) => {
  return {
    type: SET_LOGGED_IN,
    payload: isLoggedIn,
  };
}

export const setLoggedOut = (isLoggedIn) => {
    return {
        type: SET_LOGGED_OUT,
        payload: isLoggedIn,
    };
}

export const setUserData = (userData) => {
    return {
        type: SET_USER_DATA,
        payload: userData,
    }
}