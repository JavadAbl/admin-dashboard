import type { PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import type { AppState } from "./AppSlice";

export const appReducers = {
  setTheme: (
    state: WritableDraft<AppState>,
    action: PayloadAction<{
      theme: string;
    }>,
  ) => {
    const { theme } = action.payload;
    state.theme = theme;
  },
};
