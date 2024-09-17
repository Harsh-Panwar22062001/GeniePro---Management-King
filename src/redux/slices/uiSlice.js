// src/redux/slices/uiSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMobile: false,  // Initial value for mobile state
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobile: (state, action) => {
      state.isMobile = action.payload;
    },
  },
});

export const { setMobile } = uiSlice.actions;

export default uiSlice.reducer;
