import { createSlice } from "@reduxjs/toolkit";
import { customerReducers } from "./CustomerReducers";

export type CustomerState = object;

const initialState: CustomerState = {};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: customerReducers,
});

export const customerActions = customerSlice.actions;
