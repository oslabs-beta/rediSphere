import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeUser: '',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    SET_USER: (state, action) => {
      const user = action.payload;
      state.activeUser = user;
    },
  },
});

export const { SET_USER } = dashboardSlice.actions;
export default dashboardSlice.reducer;
