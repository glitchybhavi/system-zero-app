import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Activity, Play, RotateCcw, CheckCircle2, ArrowDown, ArrowUp, AlertCircle } from 'lucide-react';
import {
  setDatapathOperands,
  setDatapathOperation,
  setDatapathExecuting,
  commitDatapathResult,
  resetDatapath,
} from './store/isaSlice';
import { useIsaContext } from './context/IsaContext';

export default function DataPathSection() {
  const dispatch = useDispatch();
  const { acVal, drVal, operation, isExecuting, lastResult } = useSelector(
    (state) => state.isa.datapath
  );
  const { displayRadix } = useIsaContext();

  // Controlled form state for direct numerical inputs
  const [inputAc, setInputAc] = useState(acVal.toString());
  const [inputDr, setInputDr] = useState(drVal.toString());
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setInputAc(acVal.toString());
  }, [acVal]);

  useEffect(() => {
    setInputDr(drVal.toString());
  }, [drVal]);

  // Compute ALU output helper
  const computeAlu = (op, a, b) => {
    let res = 0;
    let carry = false;
    switch (op) {
      case 'ADD':
        res = a + b;
        if (res > 65535) carry = true;
        res = res & 0xffff;
        break;
      case 'SUB':
        res = a - b;
        if (res < 0) res = (res + 65536) & 0xffff;
        break;
      case 'AND':
        res = (a & b) & 0xffff;
        break;
      case 'OR':
        res = (a | b) & 0xffff;
        break;
      case 'XOR':
        res = (a ^ b) & 0xffff;
        break;
      default:
        res = a;
    }
    const zero = res === 0;
    const sign = (res & 0x8000) !== 0;
    return { res, zero, sign, carry };
  };

  const currentResult = computeAlu(operation, acVal, drVal);

  // Form submission handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const parsedAc = parseInt(inputAc, 10);
    const parsedDr = parseInt(inputDr, 10);

    if (isNaN(parsedAc) || parsedAc < 0 || parsedAc > 65535) {
      setFormError('AC operand must be between 0 and 65535');
      return;
    }
    if (isNaN(parsedDr) || parsedDr < 0 || parsedDr > 65535) {
      setFormError('DR operand must be between 0 and 65535');
      return;
    }

    setFormError('');
    dispatch(setDatapathOperands({ acVal: parsedAc, drVal: parsedDr }));
  };

  const handleExecute = () => {
    dispatch(setDatapathExecuting(true));
    setTimeout(() => {
      dispatch(commitDatapathResult(currentResult));
    }, 600);
  };

  const handleReset = () => {
    dispatch(resetDatapath());
    setFormError('');
  };

  const formatVal = (val) => {
    if (displayRadix === 'dec') return val.toString();
    return `0x${val.toString(16).toUpperCase().padStart(4, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6 border-b border-borderLine">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-10">
        
        {/* Left: Interactive Dialogue Card with React Form Handling */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6]">
                  <Activity size={20} />
                </div>
                <h3 className="font-mono font-bold text-xl text-textMain">CPU Datapath & ALU</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/20">
                Redux & Form Driven
              </span>
            </div>
            
            <p className="text-sm text-textMuted leading-relaxed mb-5">
              The internal datapath channels register values into the Arithmetic Logic Unit. The ALU processes the operands and latches the final result back into the Accumulator register.
            </p>

            <div className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-4 font-mono text-xs">
              
              {/* Controlled Operands Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-textMuted font-bold">1. Operand Registers Input Form:</span>
                  {formError && (
                    <span className="text-red-400 text-[10px] flex items-center gap-1">
                      <AlertCircle size={10} /> {formError}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="ac-input" className="text-textMuted block text-[11px]">
                      Accumulator (AC):
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(0, acVal - 1);
                          dispatch(setDatapathOperands({ acVal: next }));
                        }}
                        className="px-2 py-1 rounded border border-borderLine bg-background hover:text-textMain text-textMuted"
                      >
                        -
                      </button>
                      <input
                        id="ac-input"
                        type="number"
                        min="0"
                        max="65535"
                        value={inputAc}
                        onChange={(e) => setInputAc(e.target.value)}
                        className="w-full text-center py-1 rounded border border-borderLine bg-card font-bold text-[#ff007f] outline-none focus:border-primary text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = (acVal + 1) & 0xffff;
                          dispatch(setDatapathOperands({ acVal: next }));
                        }}
                        className="px-2 py-1 rounded border border-borderLine bg-background hover:text-textMain text-textMuted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="dr-input" className="text-textMuted block text-[11px]">
                      Data Register (DR):
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(0, drVal - 1);
                          dispatch(setDatapathOperands({ drVal: next }));
                        }}
                        className="px-2 py-1 rounded border border-borderLine bg-background hover:text-textMain text-textMuted"
                      >
                        -
                      </button>
                      <input
                        id="dr-input"
                        type="number"
                        min="0"
                        max="65535"
                        value={inputDr}
                        onChange={(e) => setInputDr(e.target.value)}
                        className="w-full text-center py-1 rounded border border-borderLine bg-card font-bold text-[#00f2fe] outline-none focus:border-primary text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = (drVal + 1) & 0xffff;
                          dispatch(setDatapathOperands({ drVal: next }));
                        }}
                        className="px-2 py-1 rounded border border-borderLine bg-background hover:text-textMain text-textMuted"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-1 rounded bg-card hover:bg-card/80 border border-borderLine text-textMuted hover:text-textMain text-[10px] uppercase font-bold tracking-wider transition-all"
                >
                  Apply Operands to Bus
                </button>
              </form>

              {/* ALU Operation Selectors */}
              <div>
                <span className="text-textMuted block mb-1.5 text-[11px]">2. ALU Operation Function:</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {['ADD', 'SUB', 'AND', 'OR', 'XOR'].map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => dispatch(setDatapathOperation(op))}
                      className={`py-1.5 rounded border text-xs transition-all ${
                        operation === op
                          ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6] font-bold'
                          : 'bg-background border-borderLine text-textMuted hover:text-textMain'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="flex-1 py-2 px-3 bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 border border-[#8b5cf6]/40 text-[#8b5cf6] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs shadow-md"
                >
                  <Play size={14} className={isExecuting ? 'animate-spin' : ''} />
                  {isExecuting ? 'COMPUTING BUS CYCLE...' : 'CLOCK PULSE: EXECUTE'}
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 border border-borderLine bg-background/50 hover:bg-red-500/20 text-textMuted hover:text-red-400 rounded-lg transition-all"
                  title="Reset Operands"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* Status Flags */}
              <div className="pt-2 border-t border-borderLine flex justify-between items-center text-xs">
                <span className="text-textMuted">Status Flags:</span>
                <div className="flex gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded border text-[10px] ${
                      currentResult.zero
                        ? 'bg-[#1fd655]/20 border-[#1fd655] text-[#1fd655] font-bold'
                        : 'border-borderLine text-textMuted/40'
                    }`}
                  >
                    Z:{currentResult.zero ? '1' : '0'}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded border text-[10px] ${
                      currentResult.sign
                        ? 'bg-[#ffcc00]/20 border-[#ffcc00] text-[#ffcc00] font-bold'
                        : 'border-borderLine text-textMuted/40'
                    }`}
                  >
                    S:{currentResult.sign ? '1' : '0'}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded border text-[10px] ${
                      currentResult.carry
                        ? 'bg-[#ff007f]/20 border-[#ff007f] text-[#ff007f] font-bold'
                        : 'border-borderLine text-textMuted/40'
                    }`}
                  >
                    C:{currentResult.carry ? '1' : '0'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right: Pure React 2D Datapath Architecture Visualizer */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between border-b border-borderLine pb-3 mb-5">
              <span className="font-mono text-xs text-textMuted tracking-wider uppercase flex items-center gap-1.5">
                <Activity size={14} className="text-[#8b5cf6]" /> Arithmetic Core & Datapath
              </span>
              <span className="font-mono text-[11px] text-textMuted">
                ALU: {operation} MODE
              </span>
            </div>

            {/* Visualizer Schematic */}
            <div className="w-full flex flex-col items-center font-mono text-xs py-2">
              
              {/* Registers Row */}
              <div className="w-full grid grid-cols-2 gap-6 mb-3">
                <div className="p-3 rounded-xl border border-[#ff007f]/40 bg-[#ff007f]/10 text-center">
                  <div className="text-[10px] text-textMuted">SOURCE REGISTER A</div>
                  <div className="text-base font-bold text-[#ff007f]">AC: {formatVal(acVal)}</div>
                  <div className="text-[9px] text-textMuted">Raw: {acVal}</div>
                </div>

                <div className="p-3 rounded-xl border border-[#00f2fe]/40 bg-[#00f2fe]/10 text-center">
                  <div className="text-[10px] text-textMuted">SOURCE REGISTER B</div>
                  <div className="text-base font-bold text-[#00f2fe]">DR: {formatVal(drVal)}</div>
                  <div className="text-[9px] text-textMuted">Raw: {drVal}</div>
                </div>
              </div>

              {/* Data Flow Bus Down */}
              <div className="flex justify-around w-full text-textMuted/50 my-1">
                <div className="flex flex-col items-center">
                  <ArrowDown size={16} className={isExecuting ? 'text-[#ff007f] animate-bounce' : ''} />
                </div>
                <div className="flex flex-col items-center">
                  <ArrowDown size={16} className={isExecuting ? 'text-[#00f2fe] animate-bounce' : ''} />
                </div>
              </div>

              {/* ALU Trapezoid Block */}
              <div
                className={`w-3/4 py-4 px-6 rounded-2xl border text-center transition-all shadow-lg ${
                  isExecuting
                    ? 'bg-[#8b5cf6]/30 border-[#8b5cf6] scale-105 shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                    : 'bg-background/90 border-borderLine'
                }`}
              >
                <div className="text-[10px] text-textMuted uppercase tracking-widest font-semibold">
                  Arithmetic Logic Unit
                </div>
                <div className="text-xl font-black text-textMain tracking-wider mt-1">
                  {operation} ({acVal}, {drVal})
                </div>
                <div className="text-[11px] text-[#8b5cf6] font-bold mt-1">
                  &rarr; Output: {formatVal(currentResult.res)}
                </div>
              </div>

              {/* Feedback Bus Arrow (Loop back to AC) */}
              <div className="w-full flex items-center justify-between text-textMuted text-[10px] mt-3 px-2">
                <span className="flex items-center gap-1">
                  <ArrowUp size={14} className={isExecuting ? 'text-[#8b5cf6] animate-pulse' : ''} />
                  Result loops back into AC on clock pulse
                </span>
                <span className="text-primary font-bold">16-BIT BUS</span>
              </div>

            </div>

            {/* Dynamic Synthesis Box */}
            <div className="w-full bg-background/80 p-3.5 rounded-xl border border-borderLine font-mono text-xs space-y-2 mt-3">
              <div className="flex items-center justify-between text-textMuted text-[10px] uppercase">
                <span>Cycle Summary:</span>
                <span className="text-[#8b5cf6] font-bold">
                  {isExecuting ? 'Latching Output Bus...' : 'Ready for Next Cycle'}
                </span>
              </div>
              <div className="text-xs font-semibold text-textMain bg-card/40 p-2 rounded border border-borderLine">
                Operation: AC ← AC {operation === 'ADD' ? '+' : operation === 'SUB' ? '-' : operation} DR
              </div>
              <div className="text-[11px] text-textMuted flex items-center gap-1.5 pt-1 border-t border-borderLine">
                <CheckCircle2 size={13} className="text-[#1fd655] shrink-0" />
                <span>
                  {lastResult
                    ? `Calculation complete: ${formatVal(acVal)} latched into Accumulator.`
                    : 'Press Clock Pulse: Execute to latch computation into Accumulator.'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
