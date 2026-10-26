import { createSlice } from '@reduxjs/toolkit';

const OPCODES = [
  { name: 'AND', bin: '000', desc: 'Bitwise AND memory with AC' },
  { name: 'ADD', bin: '001', desc: 'Add memory word to AC' },
  { name: 'LDA', bin: '010', desc: 'Load AC from memory' },
  { name: 'STA', bin: '011', desc: 'Store AC to memory' },
  { name: 'BUN', bin: '100', desc: 'Branch unconditionally' },
];

const DECODER_MAPPINGS = [
  { bits: '000', out: 'D0', name: 'AND', target: 'ALU Bitwise AND Gate', desc: 'Performs AC ← AC ∧ M[AR]' },
  { bits: '001', out: 'D1', name: 'ADD', target: 'ALU Binary Full Adder', desc: 'Performs AC ← AC + M[AR]' },
  { bits: '010', out: 'D2', name: 'LDA', target: 'AC Load Enable Line', desc: 'Performs AC ← M[AR]' },
  { bits: '011', out: 'D3', name: 'STA', target: 'RAM Memory Write Line', desc: 'Performs M[AR] ← AC' },
  { bits: '100', out: 'D4', name: 'BUN', target: 'PC Branch Load Gate', desc: 'Performs PC ← AR (Unconditional jump)' },
  { bits: '101', out: 'D5', name: 'BSA', target: 'Subroutine Return Latch', desc: 'Performs M[AR] ← PC, PC ← AR + 1' },
  { bits: '110', out: 'D6', name: 'ISZ', target: 'Increment & Skip Comparator', desc: 'Increments M[AR], skips next cycle if zero' },
  { bits: '111', out: 'D7', name: 'SYS', target: 'Register / I-O Control Block', desc: 'Directs register operations (CLA, CMA, HLT) or I/O' },
];

const compute16Bit = (mode, opBin, address) => {
  const addrInt = parseInt(address, 16) || 0;
  const addrBin = (addrInt & 0xfff).toString(2).padStart(12, '0');
  return `${mode}${opBin}${addrBin}`;
};

const initialInstruction = {
  mode: '0',
  opcode: 'ADD',
  opBin: '001',
  address: '0x08A',
  desc: 'Add memory word to AC',
  full16Bit: compute16Bit('0', '001', '0x08A'),
};

const initialState = {
  instruction: initialInstruction,
  cycle: {
    currentStep: 0,
    isAutoPlaying: false,
  },
  control: {
    b14: 0,
    b13: 0,
    b12: 1, // '001' -> ADD (D1)
  },
  datapath: {
    acVal: 14,
    drVal: 8,
    operation: 'ADD',
    isExecuting: false,
    lastResult: null,
  },
};

export const isaSlice = createSlice({
  name: 'isa',
  initialState,
  reducers: {
    // Instruction Format Actions
    setInstruction: (state, action) => {
      const { mode, opcode, address } = action.payload;
      const foundOp = OPCODES.find((op) => op.name === opcode) || OPCODES[1];
      state.instruction = {
        mode: mode ?? state.instruction.mode,
        opcode: foundOp.name,
        opBin: foundOp.bin,
        address: address ?? state.instruction.address,
        desc: foundOp.desc,
        full16Bit: compute16Bit(
          mode ?? state.instruction.mode,
          foundOp.bin,
          address ?? state.instruction.address
        ),
      };
      // Keep control bits in sync with selected opcode
      state.control.b14 = parseInt(foundOp.bin[0], 10);
      state.control.b13 = parseInt(foundOp.bin[1], 10);
      state.control.b12 = parseInt(foundOp.bin[2], 10);
    },

    // Cycle Stepping Actions
    stepCycle: (state) => {
      state.cycle.currentStep = (state.cycle.currentStep + 1) % 4;
    },
    setCycleStep: (state, action) => {
      state.cycle.currentStep = action.payload % 4;
    },
    resetCycle: (state) => {
      state.cycle.currentStep = 0;
      state.cycle.isAutoPlaying = false;
    },
    setAutoPlaying: (state, action) => {
      state.cycle.isAutoPlaying = action.payload;
    },

    // Control Unit Decoder Actions
    setControlBit: (state, action) => {
      const { bit, value } = action.payload; // bit: 14 | 13 | 12
      if (bit === 14) state.control.b14 = value;
      if (bit === 13) state.control.b13 = value;
      if (bit === 12) state.control.b12 = value;

      const bits = `${state.control.b14}${state.control.b13}${state.control.b12}`;
      const foundOp = OPCODES.find((op) => op.bin === bits);
      if (foundOp) {
        state.instruction.opcode = foundOp.name;
        state.instruction.opBin = foundOp.bin;
        state.instruction.desc = foundOp.desc;
        state.instruction.full16Bit = compute16Bit(
          state.instruction.mode,
          foundOp.bin,
          state.instruction.address
        );
      }
    },
    setControlOpcodePreset: (state, action) => {
      const bits = action.payload; // e.g. '001'
      state.control.b14 = parseInt(bits[0], 10);
      state.control.b13 = parseInt(bits[1], 10);
      state.control.b12 = parseInt(bits[2], 10);

      const foundOp = OPCODES.find((op) => op.bin === bits);
      if (foundOp) {
        state.instruction.opcode = foundOp.name;
        state.instruction.opBin = foundOp.bin;
        state.instruction.desc = foundOp.desc;
        state.instruction.full16Bit = compute16Bit(
          state.instruction.mode,
          foundOp.bin,
          state.instruction.address
        );
      }
    },

    // Datapath Actions
    setDatapathOperands: (state, action) => {
      const { acVal, drVal } = action.payload;
      if (acVal !== undefined) state.datapath.acVal = acVal;
      if (drVal !== undefined) state.datapath.drVal = drVal;
    },
    setDatapathOperation: (state, action) => {
      state.datapath.operation = action.payload;
    },
    setDatapathExecuting: (state, action) => {
      state.datapath.isExecuting = action.payload;
    },
    commitDatapathResult: (state, action) => {
      state.datapath.acVal = action.payload.res;
      state.datapath.lastResult = action.payload;
      state.datapath.isExecuting = false;
    },
    resetDatapath: (state) => {
      state.datapath.acVal = 14;
      state.datapath.drVal = 8;
      state.datapath.operation = 'ADD';
      state.datapath.lastResult = null;
      state.datapath.isExecuting = false;
    },
  },
});

export const {
  setInstruction,
  stepCycle,
  setCycleStep,
  resetCycle,
  setAutoPlaying,
  setControlBit,
  setControlOpcodePreset,
  setDatapathOperands,
  setDatapathOperation,
  setDatapathExecuting,
  commitDatapathResult,
  resetDatapath,
} = isaSlice.actions;

export default isaSlice.reducer;
