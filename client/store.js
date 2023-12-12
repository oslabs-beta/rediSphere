import { configureStore } from '@reduxjs/toolkit';
import dashboardSlice from './dashboardReducer';

const store = configureStore({
  reducer: {
    dashboard: dashboardSlice,
  },
});

export default store;
