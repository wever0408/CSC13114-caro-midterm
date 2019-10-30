/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/user/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post('/user/login', userData)
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

export const loginWithFacebook = () => {
 
};

export const loginWithGoogle = () => {
  return dispatch => {
    window.open(
      `http://localhost:5000/auth/google`,
      'mywindow',
      'location=1,status=1,scrollbars=1, width=700,height=550'
    );

    window.addEventListener('message', function getData(message) {
      const { data } = message;
      if (data.returnCode) {
        window.removeEventListener('message', getData);
        if (data.returnCode === 1) {
         
          // Save to localStorage

          // Set token to localStorage
          const { token } = data;
          localStorage.setItem('jwtToken', token);
          // Set token to Auth header
          setAuthToken(token);
          // Decode token to get user data
          const decoded = jwt_decode(token);
          // Set current user
          dispatch(setCurrentUser(decoded));
        }
        return  dispatch({
          type: GET_ERRORS,
          payload: data.message
        });
      }
      return null;
    });
    return null;
  };
};
