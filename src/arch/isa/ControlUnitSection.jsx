import { useDispatch, useSelector } from 'react-redux';
import { Cpu, Radio, CheckCircle2 } from 'lucide-react';
import { setControlBit, setControlOpcodePreset } from './store/isaSlice';

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

export default function ControlUnitSection() {
  const dispatch = useDispatch();
  const { b14, b13, b12 } = useSelector((state) => state.isa.control);

  const bitString = `${b14}${b13}${b12}`;
  const activeIndex = parseInt(bitString, 2);
  const activeOp = DECODER_MAPPINGS[activeIndex] || DECODER_MAPPINGS[1];

  const handleToggleBit = (bit, currentVal) => {
    dispatch(setControlBit({ bit, value: currentVal === 0 ? 1 : 0 }));
  };

  const handleSelectOpcode = (bits) => {
    dispatch(setControlOpcodePreset(bits));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6 border-b border-borderLine">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left: Interactive Dialogue Card */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#ffcc00]/20 text-[#ffcc00]">
                  <Cpu size={20} />
                </div>
                <h3 className="font-mono font-bold text-xl text-textMain">Control Unit & 3-to-8 Decoder</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ffcc00]/10 text-[#ffcc00] border border-[#ffcc00]/20">
                Redux Synchronized
              </span>
            </div>
            
            <p className="text-sm text-textMuted leading-relaxed mb-5">
              The Control Unit turns opcode bits into real electrical trigger signals. A hardware 3-to-8 decoder reads 3 opcode bits and asserts exactly one control wire (<span className="font-mono text-[#ffcc00] font-bold">D0–D7</span>).
            </p>

            <div className="bg-background/80 p-4 rounded-xl border border-borderLine space-y-4 font-mono text-xs">
              
              {/* Bit Toggle Controls */}
              <div>
                <span className="text-textMuted block mb-2">1. Manual Opcode Input Bits (14, 13, 12):</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-textMuted block mb-1">Bit 14</span>
                    <button
                      type="button"
                      onClick={() => handleToggleBit(14, b14)}
                      className={`w-full py-2 rounded-lg border font-bold text-sm transition-all ${
                        b14 === 1
                          ? 'bg-[#ffcc00]/20 border-[#ffcc00] text-[#ffcc00]'
                          : 'bg-background border-borderLine text-textMuted'
                      }`}
                    >
                      {b14}
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-textMuted block mb-1">Bit 13</span>
                    <button
                      type="button"
                      onClick={() => handleToggleBit(13, b13)}
                      className={`w-full py-2 rounded-lg border font-bold text-sm transition-all ${
                        b13 === 1
                          ? 'bg-[#ffcc00]/20 border-[#ffcc00] text-[#ffcc00]'
                          : 'bg-background border-borderLine text-textMuted'
                      }`}
                    >
                      {b13}
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-textMuted block mb-1">Bit 12</span>
                    <button
                      type="button"
                      onClick={() => handleToggleBit(12, b12)}
                      className={`w-full py-2 rounded-lg border font-bold text-sm transition-all ${
                        b12 === 1
                          ? 'bg-[#ffcc00]/20 border-[#ffcc00] text-[#ffcc00]'
                          : 'bg-background border-borderLine text-textMuted'
                      }`}
                    >
                      {b12}
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Opcode Quick Selector */}
              <div>
                <span className="text-textMuted block mb-1.5">2. Or Choose Standard Instruction:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {DECODER_MAPPINGS.map((op) => {
                    const isSelected = op.bits === bitString;
                    return (
                      <button
                        key={op.name}
                        type="button"
                        onClick={() => handleSelectOpcode(op.bits)}
                        className={`py-1 px-1.5 rounded border text-[11px] transition-all flex flex-col items-center ${
                          isSelected
                            ? 'bg-[#ffcc00]/20 border-[#ffcc00] text-[#ffcc00] font-bold'
                            : 'bg-background border-borderLine text-textMuted hover:text-textMain'
                        }`}
                      >
                        <span>{op.name}</span>
                        <span className="text-[9px] opacity-70">{op.bits}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status synthesis */}
              <div className="pt-2 border-t border-borderLine space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-textMuted">Asserted Control Line:</span>
                  <span className="text-[#ffcc00] font-bold text-sm">
                    {activeOp.out} = 1 (HIGH)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-textMuted">Target Subsystem:</span>
                  <span className="text-textMain font-medium truncate max-w-[190px]">
                    {activeOp.target}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right: Pure React 2D Hardware Decoder Schematic */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-borderLine p-7 rounded-2xl shadow-xl flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between border-b border-borderLine pb-3 mb-5">
              <span className="font-mono text-xs text-textMuted tracking-wider uppercase flex items-center gap-1.5">
                <Radio size={14} className="text-[#ffcc00]" /> 74LS138 Integrated Decoder
              </span>
              <span className="font-mono text-[11px] text-textMuted">
                BUS: {bitString} &rarr; {activeOp.out}
              </span>
            </div>

            {/* Hardware Schematic Visual */}
            <div className="w-full flex items-center justify-between gap-2 font-mono py-2">
              
              {/* 3 Input Wire Traces */}
              <div className="flex flex-col gap-5 text-xs w-20">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-textMuted">I2:</span>
                  <div
                    className={`flex-1 py-1 px-1.5 rounded text-center text-xs font-bold border transition-all ${
                      b14 === 1
                        ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe]'
                        : 'bg-background border-borderLine text-textMuted'
                    }`}
                  >
                    {b14}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-textMuted">I1:</span>
                  <div
                    className={`flex-1 py-1 px-1.5 rounded text-center text-xs font-bold border transition-all ${
                      b13 === 1
                        ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe]'
                        : 'bg-background border-borderLine text-textMuted'
                    }`}
                  >
                    {b13}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-textMuted">I0:</span>
                  <div
                    className={`flex-1 py-1 px-1.5 rounded text-center text-xs font-bold border transition-all ${
                      b12 === 1
                        ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-[#00f2fe]'
                        : 'bg-background border-borderLine text-textMuted'
                    }`}
                  >
                    {b12}
                  </div>
                </div>
              </div>

              {/* Wire Bridge In */}
              <div className="flex flex-col justify-around h-32 w-6 text-textMuted/40">
                <span className={b14 === 1 ? 'text-[#00f2fe]' : ''}>&mdash;&rsaquo;</span>
                <span className={b13 === 1 ? 'text-[#00f2fe]' : ''}>&mdash;&rsaquo;</span>
                <span className={b12 === 1 ? 'text-[#00f2fe]' : ''}>&mdash;&rsaquo;</span>
              </div>

              {/* Central Decoder Chip Block */}
              <div className="flex-1 py-5 px-3 rounded-2xl border border-borderLine bg-background/90 shadow-md flex flex-col items-center justify-center text-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffcc00] animate-pulse mb-2 shadow-[0_0_10px_#ffcc00]" />
                <div className="text-xs font-bold text-textMain">3-to-8</div>
                <div className="text-[10px] text-textMuted tracking-wider font-semibold">DECODER</div>
                <div className="text-[9px] text-[#ffcc00] mt-2 font-mono bg-[#ffcc00]/10 px-2 py-0.5 rounded border border-[#ffcc00]/20">
                  ACTIVE
                </div>
              </div>

              {/* Wire Bridge Out */}
              <div className="flex flex-col justify-between h-48 w-4 text-textMuted/30 text-[10px]">
                {DECODER_MAPPINGS.map((op, idx) => (
                  <span key={op.out} className={idx === activeIndex ? 'text-[#ffcc00] font-bold' : ''}>
                    &rsaquo;
                  </span>
                ))}
              </div>

              {/* 8 Output Wire Indicators */}
              <div className="flex flex-col gap-1 w-28 text-[10px]">
                {DECODER_MAPPINGS.map((op, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={op.out}
                      className={`px-2 py-0.5 rounded border flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#ffcc00]/20 border-[#ffcc00] text-[#ffcc00] font-bold shadow-[0_0_10px_rgba(255,204,0,0.25)]'
                          : 'bg-background/40 border-borderLine text-textMuted opacity-40'
                      }`}
                    >
                      <span>{op.out}</span>
                      <span className="text-[9px] font-sans">{op.name}</span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Detailed Function Explanation */}
            <div className="w-full bg-background/80 p-3.5 rounded-xl border border-borderLine font-mono text-xs space-y-2 mt-4">
              <div className="flex items-center justify-between text-textMuted text-[10px] uppercase">
                <span>Hardware Control Line:</span>
                <span className="text-[#ffcc00] font-bold">{activeOp.out} High (5V)</span>
              </div>
              <div className="text-xs font-semibold text-textMain bg-card/40 p-2 rounded border border-borderLine">
                {activeOp.desc}
              </div>
              <div className="text-[11px] text-textMuted flex items-center gap-1.5 pt-1 border-t border-borderLine">
                <CheckCircle2 size={13} className="text-[#1fd655] shrink-0" />
                <span>
                  All other 7 output lines are grounded (0V), preventing conflicting bus transfers.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
