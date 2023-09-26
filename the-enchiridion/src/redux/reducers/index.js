import { combineReducers } from '@reduxjs/toolkit';
import { snackbarReducer } from './snackbarReducer';
import { authReducer } from './authReducer';

export const rootReducer = combineReducers({
    snackbar: snackbarReducer,
    auth: authReducer,
});