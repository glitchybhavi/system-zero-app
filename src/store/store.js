import { configureStore } from '@reduxjs/toolkit';
import raceConditionReducer from '../os/process-synchronization/store/raceConditionSlice';
import configReducer from '../os/process-synchronization/store/configSlice';
import isaReducer from '../arch/isa/store/isaSlice';

export const store = configureStore({
  reducer: {
    config: configReducer,
    raceCondition: raceConditionReducer,
    isa: isaReducer,
  },
});


