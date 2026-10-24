import { configureStore } from '@reduxjs/toolkit';
import raceConditionReducer from '../os/process-synchronization/store/raceConditionSlice';

export const store = configureStore({
  reducer: {
    raceCondition: raceConditionReducer,
  },
});
