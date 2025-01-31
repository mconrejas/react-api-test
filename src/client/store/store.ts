import { configureStore } from "@reduxjs/toolkit";
import { referralsReducer } from "./slice";

const store = configureStore({
  reducer: {
    referrals: referralsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
