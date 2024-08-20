import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatRoom {
  lastMessage: string;
  lastMessageTimeStamp: Date; // Use `Date` type for timestamps
  messages: string[]; // Assuming this is an array of message strings
  users: string[]; // Array of user IDs
  userimg?: string | any;
  userName?: string;
}
type ChatRoomType = {
  chatRoomList: ChatRoom[];
};
const initialState: ChatRoomType = {
  chatRoomList: [],
};

export const ChatroomSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    addChatRoom: (state, action: PayloadAction<ChatRoom>) => {
      if (!state.chatRoomList.includes(action.payload)) {
        state.chatRoomList = [...state.chatRoomList!, action.payload];
      }
    },
  },
});

export const { addChatRoom } = ChatroomSlice.actions;

export default ChatroomSlice.reducer;
