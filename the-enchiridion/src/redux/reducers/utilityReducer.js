import { TRIGGER } from "../actions/utilityActions";

const initialState = {
    trigger: null,
};

export const utilityReducer = (state = initialState, action) => {
    switch (action.type) {
        case TRIGGER:
            return {
                ...state,
                trigger: action.payload,
            };
        default:
            return state;
    }
}