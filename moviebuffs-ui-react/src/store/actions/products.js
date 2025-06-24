import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "./axios";

export const RECEIVE_PRODUCTS = "RECEIVE_PRODUCTS";
export const RECEIVE_PRODUCT = "RECEIVE_PRODUCT";
export const RECEIVE_ALL_GENRES = "RECEIVE_ALL_GENRES";

export const receiveProducts = createAction(RECEIVE_PRODUCTS);
export const receiveProduct = createAction(RECEIVE_PRODUCT);
export const receiveAllGenres = createAction(RECEIVE_ALL_GENRES);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, genre = "", query = "" }, { dispatch }) => {
    // Ensure page is a number
    const pageNum = parseInt(page, 10) || 1;
    
    let queryString = `?page=${pageNum}`;
    if (query !== "") {
      queryString += `&query=${query}`;
    }
    if (genre !== "") {
      queryString += `&genre=${genre}`;
    }
    
    console.log(`Fetching products with: page=${pageNum}, genre=${genre}, query=${query}`);
    const response = await axios.get(`/api/movies${queryString}`);
    dispatch(receiveProducts(response.data));
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { dispatch }) => {
    const response = await axios.get(`/api/movies/${id}`);
    dispatch(receiveProduct(response.data));
    return response.data;
  }
);

export const fetchAllGenres = createAsyncThunk(
  'products/fetchAllGenres',
  async (_, { dispatch }) => {
    const response = await axios.get("/api/genres");
    dispatch(receiveAllGenres(response.data));
    return response.data;
  }
);
