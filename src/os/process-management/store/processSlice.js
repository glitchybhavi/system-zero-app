import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  examScore: null,
  totalQuestions: 12,
  isExamPassed: false,
  lastAttemptAt: null,
};

export const processSlice = createSlice({
  name: 'processManagement',
  initialState,
  reducers: {

    // Exam result save krne k liye 
    recordExamResult: (state, action) => {
      const { score, total, isPassed } = action.payload;
      state.examScore = score;
      state.totalQuestions = total || 12;
      state.isExamPassed = Boolean(isPassed);
      state.lastAttemptAt = new Date().toLocaleTimeString();
    },
    resetExamResult: (state) => {
      state.examScore = null;
      state.isExamPassed = false;
      state.lastAttemptAt = null;
    },
  },
});

export const { recordExamResult, resetExamResult } = processSlice.actions;
export default processSlice.reducer;
