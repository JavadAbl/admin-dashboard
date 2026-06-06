import type { WritableDraft, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./AuthSlice";
import type { User } from "./AuthTypes/User";

export const authReducers = {
  logout: (state: WritableDraft<AuthState>) => {
    state.isAuth = false;
    state.user = null;
  },

  login: (
    state: WritableDraft<AuthState>,
    action: PayloadAction<{ user: User }>,
  ) => {
    state.isAuth = true;
    state.user = action.payload.user;
  },
};
