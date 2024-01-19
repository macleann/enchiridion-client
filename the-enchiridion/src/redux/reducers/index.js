import { combineReducers } from '@reduxjs/toolkit';
import { snackbarReducer } from './snackbarReducer';
import { authReducer } from './authReducer';
import { utilityReducer } from './utilityReducer';

export const rootReducer = combineReducers({
    snackbar: snackbarReducer,
    auth: authReducer,
    utility: utilityReducer,
});