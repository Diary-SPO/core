import { configureStore } from '@reduxjs/toolkit';
import lessonReducer from './lessonSlice';

const store = configureStore({
  reducer: {
    lesson: lessonReducer,
  },
});

export default store;
