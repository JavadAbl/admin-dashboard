import type { WritableDraft } from "@reduxjs/toolkit";
import type { AuthState } from "./AuthSlice";

export const authReducers = {
  logout: (state: WritableDraft<AuthState>) => {
    state.isAuth = false;
  },

  login: (state: WritableDraft<AuthState>) => {
    state.isAuth = true;
  },
};
