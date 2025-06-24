import { createReducer } from '@reduxjs/toolkit';
import { RECEIVE_ALL_GENRES, RECEIVE_PRODUCT, RECEIVE_PRODUCTS } from "../actions/products";

const initialState = {
  genres: [],
  products: { data: [] },
  product: {}
};

const productsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(RECEIVE_PRODUCTS, (state, action) => {
      state.products = action.payload;
    })
    .addCase(RECEIVE_ALL_GENRES, (state, action) => {
      state.genres = action.payload;
    })
    .addCase(RECEIVE_PRODUCT, (state, action) => {
      state.product = action.payload;
    });
});

export default productsReducer;
