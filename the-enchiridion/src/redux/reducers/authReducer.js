import { SET_LOGGED_IN, SET_LOGGED_OUT, SET_USER_DATA } from "../actions/authActions";

const initialState = {
    isLoggedIn: false,
    userData: {},
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGGED_IN:
            return {
                ...state,
                isLoggedIn: action.payload,
            };
        case SET_LOGGED_OUT:
            return {
                ...state,
                isLoggedIn: false,
                userData: {},
            };
        case SET_USER_DATA:
            return {
                ...state,
                userData: action.payload,
            };
        default:
            return state;
    }
}