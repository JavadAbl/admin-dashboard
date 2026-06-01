import { createSlice } from "@reduxjs/toolkit";
import { authReducers } from "./AuthReducers";

export interface AuthState {
  isAuth: boolean | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuth: null,
  accessToken: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: authReducers,
});

export const authActions = authSlice.actions;
