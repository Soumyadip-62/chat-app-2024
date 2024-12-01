import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  openSideBar: true,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    toggleSidebar: (state) => {
      state.openSideBar = !state.openSideBar;
    },
    toggleSidebarFalse: (state) => {
      state.openSideBar = false;
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  toggleSidebar,
  toggleSidebarFalse,
} = counterSlice.actions;

export default counterSlice.reducer;
