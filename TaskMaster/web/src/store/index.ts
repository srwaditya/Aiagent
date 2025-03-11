import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import categoriesReducer from './slices/categoriesSlice';
import tagsReducer from './slices/tagsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    categories: categoriesReducer,
    tags: tagsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;