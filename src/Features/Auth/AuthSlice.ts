import { createSlice } from "@reduxjs/toolkit";
import { authReducers } from "./AuthReducers";
import type { User } from "./AuthTypes/User";

export interface AuthState {
  isAuth: boolean | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isAuth: null,
  accessToken: null,
  refreshToken: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: authReducers,
});

export const authActions = authSlice.actions;
