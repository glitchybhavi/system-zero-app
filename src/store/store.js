import { configureStore } from '@reduxjs/toolkit';
import raceConditionReducer from '../os/process-synchronization/store/raceConditionSlice';
import configReducer from '../os/process-synchronization/store/configSlice';

export const store = configureStore({
  reducer: {
    config: configReducer,
    raceCondition: raceConditionReducer,
  },
});

