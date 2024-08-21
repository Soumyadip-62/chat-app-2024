import { ChatListProps } from "@/lib/types/chatlist.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";

export interface ChatRoom {
  lastMessage: string;
  lastMessageTimeStamp: Timestamp | any; // Use `Date` type for timestamps
  messages: string[]; // Assuming this is an array of message strings
  users: any[]; // Array of user IDs
  userimg?: string | any;
  userName?: string;
  chatId: string;
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
      // Check if the chat room already exists
      const chatRoomExists = state.chatRoomList.some(
        (item) => item.chatId === action.payload.chatId
      );

      if (!chatRoomExists) {
        state.chatRoomList = [...state.chatRoomList, action.payload];
      }
    },
    resetChatRoom: (state, action: PayloadAction<ChatRoom>) => {
      if (!state.chatRoomList.includes(action.payload)) {
        state.chatRoomList = [action.payload];
      }
    },
  },
});

export const { addChatRoom, resetChatRoom } = ChatroomSlice.actions;

export default ChatroomSlice.reducer;
