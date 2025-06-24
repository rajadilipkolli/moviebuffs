import { createReducer } from '@reduxjs/toolkit';
import * as actionTypes from "../actions/actionTypes";

const initialState = {};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(actionTypes.LOGIN_SUCCESS, (state, action) => {
      return action.payload || {};
    })
    .addCase(actionTypes.LOGIN_FAILURE, () => {
      return { loginError: true };
    })
    .addCase(actionTypes.LOGOUT, () => {
      return {};
    });
});

export default userReducer;
