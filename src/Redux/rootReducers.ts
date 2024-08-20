import { combineReducers } from "@reduxjs/toolkit";
import counterReducer from "./slices/globalSlice";
import userReducer from "./slices/UserSlice";
import chatRoomReducer from "./slices/ChatroomSlice";


// Replace with your slice

const rootReducer = combineReducers({
  counter: counterReducer,
  userdata: userReducer,
  chatroom: chatRoomReducer,
});

export default rootReducer;
