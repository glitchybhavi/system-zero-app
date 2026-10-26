import { createSlice } from '@reduxjs/toolkit';
import { MAX_TRACK } from '../diskAlgorithms';

const DEFAULT_QUEUE = [98, 183, 37, 122, 14, 124, 65, 67];
const DEFAULT_HEAD = 53;

const initialState = {
  algorithm: 'SSTF',
  queue: DEFAULT_QUEUE,
  head: DEFAULT_HEAD,
  direction: 'inward', // 'inward' (-> 199) | 'outward' (-> 0)
  currentStepIndex: 0,
  isAutoPlaying: false,
  isSeeking: false,
};

export const diskSlice = createSlice({
  name: 'disk',
  initialState,
  reducers: {
    setAlgorithm: (state, action) => {
      state.algorithm = action.payload;
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
      state.isSeeking = false;
    },
    setCustomQueue: (state, action) => {
      const { queue, head } = action.payload;
      if (Array.isArray(queue)) {
        state.queue = queue.filter((t) => typeof t === 'number' && !isNaN(t) && t >= 0 && t <= MAX_TRACK);
      }
      if (typeof head === 'number' && !isNaN(head)) {
        state.head = Math.max(0, Math.min(MAX_TRACK, head));
      }
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
      state.isSeeking = false;
    },
    setHead: (state, action) => {
      state.head = Math.max(0, Math.min(MAX_TRACK, Number(action.payload) || 0));
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
      state.isSeeking = false;
    },
    setDirection: (state, action) => {
      state.direction = action.payload;
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
      state.isSeeking = false;
    },
    stepSeek: (state, action) => {
      const totalSteps = action.payload ?? 0;
      if (state.currentStepIndex < totalSteps) {
        state.currentStepIndex += 1;
        state.isSeeking = true;
      }
    },
    setStepIndex: (state, action) => {
      state.currentStepIndex = action.payload;
    },
    setAutoPlaying: (state, action) => {
      state.isAutoPlaying = action.payload;
    },
    setIsSeeking: (state, action) => {
      state.isSeeking = action.payload;
    },
    resetSeek: (state) => {
      state.currentStepIndex = 0;
      state.isAutoPlaying = false;
      state.isSeeking = false;
    },
  },
});

export const {
  setAlgorithm,
  setCustomQueue,
  setHead,
  setDirection,
  stepSeek,
  setStepIndex,
  setAutoPlaying,
  setIsSeeking,
  resetSeek,
} = diskSlice.actions;

export default diskSlice.reducer;
