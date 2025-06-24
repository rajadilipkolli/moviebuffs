import { createReducer } from '@reduxjs/toolkit';
import {
  ADD_PRODUCT_TO_CART,
  ORDER_CREATION_SUCCESS,
  CLEAR_CART
} from "../actions/cart";

const initialState = { cart: [] };

const addProductToCartHandler = (state, product) => {
  const existingProductIndex = state.cart.findIndex(item => item.product.id === product.id);
  
  if (existingProductIndex !== -1) {
    // Update existing product quantity
    state.cart[existingProductIndex].quantity += 1;
  } else {
    // Add new product
    state.cart.push({ product: product, quantity: 1 });
  }
};

const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ADD_PRODUCT_TO_CART, (state, action) => {
      addProductToCartHandler(state, action.payload);
    })
    .addCase(ORDER_CREATION_SUCCESS, (state) => {
      // No changes needed here
    })
    .addCase(CLEAR_CART, (state) => {
      state.cart = [];
    });
});

export default cartReducer;
