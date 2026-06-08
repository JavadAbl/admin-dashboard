import { createSlice } from "@reduxjs/toolkit";
import { customerReducers } from "./ProductReducers";

export type ProductState = object;

const initialState: ProductState = {};

export const customerSlice = createSlice({
  name: "product",
  initialState,
  reducers: customerReducers,
});

export const customerActions = customerSlice.actions;
