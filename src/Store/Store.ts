import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../Features/Auth/AuthSlice";
import { appSlice } from "../Features/App/AppSlice";

export const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authSlice.reducer,
    [appSlice.reducerPath]: appSlice.reducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
