import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from "./axios";
import * as actionTypes from "./actionTypes";

export const login = createAsyncThunk(
  'user/login',
  async (credentials, { dispatch }) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: response.data
      });
      return response.data;
    } catch (e) {
      console.log("login error", e);
      dispatch({
        type: actionTypes.LOGIN_FAILURE
      });
      throw e;
    }
  }
);
