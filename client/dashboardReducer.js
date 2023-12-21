import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  widgetArray: [],
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
    SET_WIDGETS: (state, action) => {
      const widgets = action.payload;
      const newArray = [];
      widgets.forEach((el) => newArray.push(el));
      state.widgetArray = newArray;
    },
  },
});

export const { SET_USER, SET_WIDGETS } = dashboardSlice.actions;
export default dashboardSlice.reducer;
