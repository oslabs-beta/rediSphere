import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  widgetArray: [],
  loggedIn: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    SET_WIDGETS: (state, action) => {
      const widgets = action.payload;
      const newArray = [];
      widgets.forEach((el) => newArray.push(el));
      state.widgetArray = newArray;
    },
    LOGIN_USER: (state) => {
      state.loggedIn = true;
    },
    LOGOUT_USER: (state) => {
      state.loggedIn = false;
    },
  },
});

export const { LOGIN_USER, LOGOUT_USER, SET_WIDGETS } = dashboardSlice.actions;
export default dashboardSlice.reducer;
