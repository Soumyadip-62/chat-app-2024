import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/globalSlice";
import rootReducer from "./rootReducers";

const store = configureStore({
  reducer: {
    rootstate: rootReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
