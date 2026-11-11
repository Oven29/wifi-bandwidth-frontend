import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/model/authSlice';
import filterReducer from '../../features/activity-filter/model/filterSlice';
import activityReducer from '../../entities/activity/model/activitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filter: filterReducer,
    activity: activityReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
