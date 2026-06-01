import { createSlice } from "@reduxjs/toolkit";
import { appReducers } from "./AppReducers";
import { storage } from "../../Utils/Storage";

export interface AppState {
  theme: string | null;
}

const initialState: AppState = { theme: storage.getTheme() };

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: appReducers,
});

export const appActions = appSlice.actions;
