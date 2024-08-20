import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatRoom {
  lastMessage: string;
  lastMessageTimeStamp: Date; // Use `Date` type for timestamps
  messages: string[]; // Assuming this is an array of message strings
  users: string[]; // Array of user IDs
}
type ChatRoomType = {
  chatRoomList: ChatRoom[] | null;
};
const initialState: ChatRoomType = {
  chatRoomList: null,
};

export const ChatroomSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    addChatRoom: (state, action: PayloadAction<ChatRoom>) => {
      state.chatRoomList = [...state.chatRoomList!, action.payload];
    },
  },
});

export const { addChatRoom } = ChatroomSlice.actions;

export default ChatroomSlice.reducer;
