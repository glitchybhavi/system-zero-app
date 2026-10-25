import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_BALANCE, INCREMENT_VALUE } from '../base/utils';

const initialState = {
  initialBalance: INITIAL_BALANCE,
  incrementValue: INCREMENT_VALUE,
  configVersion: 0,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    applyConfig: (state, action) => {
      state.initialBalance = action.payload.initialBalance;
      state.incrementValue = action.payload.incrementValue;
      state.configVersion += 1;
    },
    resetConfig: (state) => {
      state.initialBalance = INITIAL_BALANCE;
      state.incrementValue = INCREMENT_VALUE;
      state.configVersion += 1;
    },
  },
});

export const { applyConfig, resetConfig } = configSlice.actions;

export default configSlice.reducer;
