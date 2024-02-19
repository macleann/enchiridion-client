import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { hideSnackbar } from '../redux/actions/snackbarActions';
import { Slide } from '@mui/material';

export const GlobalSnackbar = () => {
  const dispatch = useDispatch();
  const { isOpen, message, severity } = useSelector(state => state.snackbar);

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  const SlideTransition = (props) => {
    return <Slide {...props} direction="up" />;
  };

  return (
    <Snackbar id='snackbar' open={isOpen} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} TransitionComponent={SlideTransition}>
      <MuiAlert onClose={handleClose} severity={severity} sx={{ width: "500%" }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}
