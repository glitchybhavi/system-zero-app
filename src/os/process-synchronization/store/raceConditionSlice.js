import { createSlice } from '@reduxjs/toolkit';
import { THREAD_COLORS } from '../base/utils';

const initialState = {
  initialBalance: 100,
  incrementValue: 10,
  balance: 100,
  expectedBalance: 100,
  count: 0,
  speed: 1,
  mode: 'manual',
  flag: [false, false],
  turn: 0,
  processes: [
    { id: 0, track: 0, line: 1, local: null, loadedBalance: null, status: 'ready', color: THREAD_COLORS[0] },
    { id: 1, track: 1, line: 1, local: null, loadedBalance: null, status: 'ready', color: THREAD_COLORS[1] },
  ],
  auditLog: ['Simulation ready.'],
};

export const raceConditionSlice = createSlice({
  name: 'raceCondition',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setSpeed: (state, action) => {
      state.speed = action.payload;
    },
    stepProcess: (state, action) => {
      const track = action.payload;
      const p = state.processes[track];
      const nextLine = p.line + 1;

      if (nextLine === 2) {
        p.line = 2;
        p.local = state.balance;
        p.loadedBalance = state.balance;
        p.status = 'in-bay';
        state.auditLog.unshift(`P${p.id} loaded balance: ₹${state.balance}`);
      } else if (nextLine === 3) {
        p.line = 3;
        p.local = p.local + state.incrementValue;
        state.auditLog.unshift(`P${p.id} computed local = ₹${p.local}`);
      } else if (nextLine === 4) {
        if (p.loadedBalance !== null && p.loadedBalance !== state.balance) {
          state.auditLog.unshift(`Race condition detected: P${p.id} overwrote balance`);
        }
        state.balance = p.local;
        state.count = state.count + 1;
        state.expectedBalance = state.initialBalance + state.count * state.incrementValue;
        p.line = 4;
        state.auditLog.unshift(`P${p.id} saved balance: ₹${p.local}`);
      } else if (nextLine === 5) {
        p.id = p.id + 2;
        p.line = 1;
        p.local = null;
        p.loadedBalance = null;
        p.status = 'ready';
        p.color = THREAD_COLORS[p.id % THREAD_COLORS.length];
        state.auditLog.unshift(`P${p.id} completed cycle`);
      }
    },
    setFlag: (state, action) => {
      state.flag[action.payload.track] = action.payload.value;
    },
    setTurn: (state, action) => {
      state.turn = action.payload;
    },
    applyConfig: (state, action) => {
      state.initialBalance = action.payload.initialBalance;
      state.incrementValue = action.payload.incrementValue;
      state.balance = action.payload.initialBalance;
      state.expectedBalance = action.payload.initialBalance;
      state.count = 0;
      state.flag = [false, false];
      state.turn = 0;
      state.processes = [
        { id: 0, track: 0, line: 1, local: null, loadedBalance: null, status: 'ready', color: THREAD_COLORS[0] },
        { id: 1, track: 1, line: 1, local: null, loadedBalance: null, status: 'ready', color: THREAD_COLORS[1] },
      ];
      state.auditLog.unshift(`Config updated: Balance ₹${action.payload.initialBalance}, Increment ₹${action.payload.incrementValue}`);
    },
    resetSim: (state) => {
      state.balance = state.initialBalance;
      state.expectedBalance = state.initialBalance;
      state.count = 0;
      state.flag = [false, false];
      state.turn = 0;
      state.processes = [
        { id: 0, track: 0, line: 1, local: null, loadedBalance: null, status: 'ready', color: THREAD_COLORS[0] },
        { id: 1, track: 1, line: 1, local: null, loadedBalance: null, status: 'ready', color: THREAD_COLORS[1] },
      ];
      state.auditLog.unshift('Simulation reset.');
    },
  },
});

export const {
  setMode,
  setSpeed,
  stepProcess,
  setFlag,
  setTurn,
  applyConfig,
  resetSim,
} = raceConditionSlice.actions;

export default raceConditionSlice.reducer;
