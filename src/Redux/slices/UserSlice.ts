import { createSlice, PayloadAction } from "@reduxjs/toolkit";




export interface User {
  id?: any;
  uid?: string;
  name?: string;
  email?: string;
  token?: string;
  avatar?: string;
  createdAt?: Date;
  deletedChats?: string[]
}
interface UserType {
  user: User | null;
}
const initialState: UserType = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
     
    },
    removeUser: (state) => {
      state.user = null;
     
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;