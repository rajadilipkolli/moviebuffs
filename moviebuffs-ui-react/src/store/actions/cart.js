import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "./axios";
import { history } from "../../history";

export const ADD_PRODUCT_TO_CART = "ADD_PRODUCT_TO_CART";
export const ORDER_CREATION_SUCCESS = "ORDER_CREATION_SUCCESS";
export const CLEAR_CART = "CLEAR_CART";

export const addProductToCart = createAction(ADD_PRODUCT_TO_CART);
export const clearCart = createAction(CLEAR_CART);
export const orderCreationSuccess = createAction(ORDER_CREATION_SUCCESS);

export const placeOrder = createAsyncThunk(
  'cart/placeOrder',
  async (order, { dispatch }) => {
    const orderObject = { ...order };
    const response = await axios.post("/api/orders", orderObject);
    dispatch(orderCreationSuccess(response.data));
    dispatch(clearCart());
    if (history && history.navigate) {
      history.navigate("/orderconfirmation/" + response.data.orderId);
    }
    return response.data;
  }
);

export const fetchOrderById = async (orderId) => {
  try {
    const response = await axios.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (e) {
    console.log("error", e);
    throw e;
  }
};
