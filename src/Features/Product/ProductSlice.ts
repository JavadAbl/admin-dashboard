import { createSlice } from "@reduxjs/toolkit";
import { productReducers } from "./ProductReducers";

export type ProductState = object;

const initialState: ProductState = {};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: productReducers,
});

export const productActions = productSlice.actions;
