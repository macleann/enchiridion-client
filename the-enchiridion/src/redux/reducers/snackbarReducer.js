import { SHOW_SNACKBAR, HIDE_SNACKBAR } from '../actions/snackbarActions';

const initialState = {
  isOpen: false,
  message: '',
  severity: 'info',
};

export const snackbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return {
        ...state,
        isOpen: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    case HIDE_SNACKBAR:
      return {
        ...state,
        isOpen: false,
        message: '',
      };
    default:
      return state;
  }
}