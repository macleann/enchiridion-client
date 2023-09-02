import { combineReducers } from '@reduxjs/toolkit';
import { snackbarReducer } from './snackbarReducer';

export const rootReducer = combineReducers({
    snackbar: snackbarReducer,
});