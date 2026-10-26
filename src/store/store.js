import { configureStore } from '@reduxjs/toolkit';
import raceConditionReducer from '../os/process-synchronization/store/raceConditionSlice';
import configReducer from '../os/process-synchronization/store/configSlice';
import isaReducer from '../arch/isa/store/isaSlice';
import diskReducer from '../storage/disk/store/diskSlice';
import processReducer from '../os/process-management/store/processSlice';

export const store = configureStore({
  reducer: {
    config: configReducer,
    raceCondition: raceConditionReducer,
    isa: isaReducer,
    disk: diskReducer,
    processManagement: processReducer,
  },
});


