import { createSlice } from '@reduxjs/toolkit';

// Read saved exam state so score survives browser reload
const loadSavedState = () => {
  try {
    const saved = localStorage.getItem('systemzero_exam_state');
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback if localStorage not accessible
  }
  return {
    examScore: null,
    totalQuestions: 12,
    isExamPassed: false,
    lastAttemptAt: null,
  };
};

const initialState = loadSavedState();

export const processSlice = createSlice({
  name: 'processManagement',
  initialState,
  reducers: {
    // Save exam result to Redux store and sync to localStorage
    recordExamResult: (state, action) => {
      const { score, total, isPassed } = action.payload;
      state.examScore = score;
      state.totalQuestions = total || 12;
      state.isExamPassed = Boolean(isPassed);
      state.lastAttemptAt = new Date().toLocaleTimeString();
      try {
        localStorage.setItem('systemzero_exam_state', JSON.stringify(state));
      } catch {}
    },
    resetExamResult: (state) => {
      state.examScore = null;
      state.isExamPassed = false;
      state.lastAttemptAt = null;
      try {
        localStorage.removeItem('systemzero_exam_state');
      } catch {}
    },
  },
});

export const { recordExamResult, resetExamResult } = processSlice.actions;
export default processSlice.reducer;
