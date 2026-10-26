import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, Play, Pause, RotateCcw, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { stepCycle, setCycleStep, resetCycle, setAutoPlaying } from './store/isaSlice';
import { useIsaContext } from './context/IsaContext';

export default function InstructionCycleSection() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.isa.cycle.currentStep);
  const isAutoPlaying = useSelector((state) => state.isa.cycle.isAutoPlaying);
  const instruction = useSelector((state) => state.isa.instruction);
  const { clockSpeed, formatRadix, displayRadix } = useIsaContext();

  const currentOpcode = instruction.opcode || 'ADD';
  const currentAddress = instruction.address || '0x08A';
  const isDirect = instruction.mode === '0';

  const CYCLE_STATES = [
    {
      step: 'T0',
      name: 'Latch Address',
      action: 'AR ← PC',
      desc: 'The Program Counter places its address onto the bus, and the Address Register latches it.',
      color: '#00f2fe',
      busMsg: 'BUS ACTIVE: PC (0x021) ➔ AR',
    },
    {
      step: 'T1',
      name: 'Fetch & Advance',
      action: 'IR ← M[AR], PC ← PC + 1',
      desc: `Instruction word (${currentOpcode} ${currentAddress}) is fetched from memory at address AR into IR. PC increments to the next word.`,
      color: '#1fd655',
      busMsg: `BUS ACTIVE: Memory[0x021] ➔ IR (${currentOpcode} ${currentAddress}) | PC → 0x022`,
    },
    {
      step: 'T2',
      name: 'Decode Opcode',
      action: 'Decode IR[14-12], AR ← IR[11-0], I ← IR[15]',
      desc: `Control Unit decodes ${currentOpcode} (Bits: ${instruction.opBin}). Operand address ${currentAddress} latched into AR. Addressing mode I = ${instruction.mode} evaluated.`,
      color: '#ffcc00',
      busMsg: `CONTROL UNIT: Opcode ${instruction.opBin} (${currentOpcode}) Decoded | Mode I = ${instruction.mode} (${isDirect ? 'Direct' : 'Indirect'})`,
    },
    {
      step: 'T3',
      name: 'Execute ALU',
      action: `AC ← AC ${currentOpcode === 'ADD' ? '+' : currentOpcode === 'AND' ? '∧' : currentOpcode} M[AR]`,
      desc: `ALU retrieves operand from Memory[${currentAddress}] and executes ${currentOpcode}. Sequence counter resets to T0.`,
      color: '#ff007f',
      busMsg: `ALU COMPUTATION: AC (0x0014) & Memory[${currentAddress}] ➔ AC Updated`,
    },
  ];

  // Auto-play timer using pacing from Context
  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        dispatch(stepCycle());
      }, clockSpeed);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, clockSpeed, dispatch]);

  const activeState = CYCLE_STATES[currentStep];

  const handleNextStep = () => {
    dispatch(setAutoPlaying(false));
    dispatch(stepCycle());
  };

  const handleReset = () => {
    dispatch(resetCycle());
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6 border-b border-borderLine">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-10">
        
        {/* Left: Interactive Dialogue Card */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#1fd655]/20 text-[#1fd655]">
                  <Clock size={20} />
                </div>
                <h3 className="font-mono font-bold text-xl text-textMain">Instruction Cycle & Timing</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1fd655]/10 text-[#1fd655] border border-[#1fd655]/20">
                Clock: {clockSpeed / 1000}s
              </span>
            </div>
            
            <p className="text-sm text-textMuted leading-relaxed mb-5">
              CPUs execute instructions in synchronized clock cycles. Each phase—Fetch, Decode, and Execute—activates specific micro-operations triggered by timing states <span className="font-mono text-primary font-bold">T0</span> through <span className="font-mono text-primary font-bold">T3</span>.
            </p>

            <div className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-4 font-mono text-xs">
              
              {/* Current Timing State */}
              <div className="flex items-center justify-between">
                <span className="text-textMuted">Active Timing State:</span>
                <span
                  className="px-2.5 py-1 rounded font-bold text-sm border"
                  style={{
                    backgroundColor: `${activeState.color}20`,
                    borderColor: `${activeState.color}60`,
                    color: activeState.color,
                  }}
                >
                  {activeState.step} : {activeState.name}
                </span>
              </div>

              {/* Micro-operation definition */}
              <div className="p-3 rounded-lg border border-borderLine bg-background">
                <div className="text-[10px] text-textMuted uppercase tracking-wider mb-1">Micro-Operation:</div>
                <div className="font-bold text-sm text-textMain tracking-wide">{activeState.action}</div>
                <div className="text-[11px] text-textMuted mt-1 leading-relaxed">{activeState.desc}</div>
              </div>

              {/* Controls */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-2 px-3 bg-[#1fd655]/20 hover:bg-[#1fd655]/30 border border-[#1fd655]/40 text-[#1fd655] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs"
                >
                  <ArrowRight size={14} /> STEP CYCLE (T++)
                </button>

                <button
                  onClick={() => dispatch(setAutoPlaying(!isAutoPlaying))}
                  className={`p-2 border rounded-lg transition-all ${
                    isAutoPlaying
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'border-borderLine bg-background/50 hover:bg-card text-textMuted hover:text-textMain'
                  }`}
                  title={isAutoPlaying ? 'Pause Auto-Cycle' : 'Auto Run Cycles'}
                >
                  {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 border border-borderLine bg-background/50 hover:bg-red-500/20 text-textMuted hover:text-red-400 rounded-lg transition-all"
                  title="Reset to T0"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              <div className="pt-1 text-[11px] text-textMuted text-center">
                {isAutoPlaying ? (
                  <span className="text-[#1fd655] animate-pulse">
                    ● Auto-stepping clock generator active ({clockSpeed / 1000}s/pulse)
                  </span>
                ) : (
                  <span>Click Step Cycle to advance sequence counter</span>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Right: Pure React 2D State Machine Visualizer */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between border-b border-borderLine pb-3 mb-5">
              <span className="font-mono text-xs text-textMuted tracking-wider uppercase flex items-center gap-1.5">
                <Zap size={14} className="text-[#1fd655]" /> Sequence Counter & Datapath
              </span>
              <span className="font-mono text-[11px] text-textMuted">
                CYCLE: {currentStep + 1} / 4
              </span>
            </div>

            {/* 4-Step Circular / Linear Pipeline Tracker */}
            <div className="w-full grid grid-cols-4 gap-2 font-mono mb-6">
              {CYCLE_STATES.map((state, idx) => {
                const isActive = currentStep === idx;
                return (
                  <div
                    key={state.step}
                    onClick={() => {
                      dispatch(setAutoPlaying(false));
                      dispatch(setCycleStep(idx));
                    }}
                    className={`cursor-pointer p-2.5 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'scale-105 shadow-lg'
                        : 'opacity-50 hover:opacity-80 bg-background/50 border-borderLine'
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: `${state.color}15`,
                            borderColor: `${state.color}80`,
                            boxShadow: `0 0 15px ${state.color}30`,
                          }
                        : {}
                    }
                  >
                    <div
                      className="text-xs font-bold"
                      style={{ color: isActive ? state.color : 'inherit' }}
                    >
                      {state.step}
                    </div>
                    <div className="text-[9px] truncate text-textMuted mt-0.5">
                      {state.name.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulated CPU Register File Status */}
            <div className="w-full grid grid-cols-2 gap-3 font-mono text-xs mb-5">
              <div className="p-3 rounded-xl border border-borderLine bg-background/80 space-y-1">
                <span className="text-[10px] text-textMuted block">PROGRAM COUNTER (PC)</span>
                <div className="text-base font-bold text-[#00f2fe]">
                  {formatRadix(currentStep >= 1 ? 0x022 : 0x021)}
                </div>
                <div className="text-[9px] text-textMuted">
                  {currentStep >= 1 ? 'Incremented' : 'Holds pointer'}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-borderLine bg-background/80 space-y-1">
                <span className="text-[10px] text-textMuted block">ADDRESS REG (AR)</span>
                <div className="text-base font-bold text-[#1fd655]">
                  {formatRadix(currentStep >= 2 ? currentAddress : currentStep >= 0 ? 0x021 : 0x000)}
                </div>
                <div className="text-[9px] text-textMuted">
                  {currentStep >= 2 ? 'Latched operand addr' : 'Latched PC addr'}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-borderLine bg-background/80 space-y-1">
                <span className="text-[10px] text-textMuted block">INSTRUCTION REG (IR)</span>
                <div className="text-base font-bold text-[#ffcc00]">
                  {currentStep >= 1 ? `${currentOpcode} ${formatRadix(currentAddress)}` : '0x0000'}
                </div>
                <div className="text-[9px] text-textMuted">
                  {currentStep >= 1 ? 'Opcode + Address' : 'Idle / Flushed'}
                </div>
              </div>

              <div className="p-3 rounded-xl border border-borderLine bg-background/80 space-y-1">
                <span className="text-[10px] text-textMuted block">ACCUMULATOR (AC)</span>
                <div className="text-base font-bold text-[#ff007f]">
                  {formatRadix(currentStep === 3 ? 0x001A : 0x0014)}
                </div>
                <div className="text-[9px] text-textMuted">
                  {currentStep === 3 ? 'Result Latched' : 'Prior Stored Value'}
                </div>
              </div>
            </div>

            {/* Dynamic Bus Traffic Display */}
            <div className="w-full bg-background/80 p-3.5 rounded-xl border border-borderLine font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-textMuted text-[10px] uppercase tracking-wider">
                <span>Internal Bus Monitor:</span>
                <span className="flex items-center gap-1 text-[#1fd655]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1fd655] animate-ping" />
                  Clock Pulse Active
                </span>
              </div>
              <div className="text-xs font-semibold text-textMain break-all bg-card/40 p-2 rounded border border-borderLine">
                {activeState.busMsg}
              </div>
              <div className="text-[11px] text-textMuted flex items-center gap-1.5 pt-1 border-t border-borderLine">
                <CheckCircle2 size={13} className="text-[#1fd655] shrink-0" />
                <span>
                  {currentStep === 3
                    ? `Instruction complete. Sequence counter SC ← 0.`
                    : `Next state will be T${currentStep + 1} on the next clock pulse.`}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
