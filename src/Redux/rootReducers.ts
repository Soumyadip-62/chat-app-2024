import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./slices/globalSlice";
import userReducer from "./slices/UserSlice";

// Replace with your slice

const rootReducer = combineReducers({
  counter: counterReducer,
  userdata: userReducer,
});

export default rootReducer;
