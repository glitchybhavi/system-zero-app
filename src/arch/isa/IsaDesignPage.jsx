import { useEffect } from 'react';
import Navbar from '../../landingPage/Navbar';
import Footer from '../../landingPage/Footer';
import InstructionFormatSection from './InstructionFormatSection';
import InstructionCycleSection from './InstructionCycleSection';
import ControlUnitSection from './ControlUnitSection';
import DataPathSection from './DataPathSection';
import { Binary, Clock, Cpu, Activity, Zap, Layers } from 'lucide-react';

export default function IsaDesignPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-background text-textMain">
      <Navbar />

      <main className="relative z-10">
        {/* HERO / OVERVIEW CARD: Matches the exact Phase Card design of Digital Logic */}
        <div className="min-h-[85vh] flex items-center justify-center py-24 px-6 border-b border-borderLine">
          <div className="w-full max-w-4xl bg-card/80 backdrop-blur-2xl border border-borderLine p-8 md:p-12 rounded-3xl shadow-2xl space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderLine pb-4">
              <span className="font-mono text-primary font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                [ PHASE 02 : INSTRUCTION SET ARCHITECTURE & CPU DESIGN ]
              </span>
              <span className="text-xs font-mono text-textMuted">
                STATUS: CORE DECODER ENGAGED
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-textMain">
                Instruction Set Architecture: <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">
                  The Hardware-Software Contract.
                </span>
              </h1>
              <p className="text-base md:text-lg text-textMuted leading-relaxed">
                Before code can run, it must be translated into binary words that hardware circuits understand. Explore how 16-bit instructions are formatted, sequenced across clock cycles, decoded into physical control wires, and calculated on the datapath.
              </p>
            </div>

            {/* Educational Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-background/60 border border-borderLine space-y-2">
                <div className="text-xs font-mono font-bold text-primary flex items-center gap-2">
                  <Layers size={14} /> THE INSTRUCTION WORD
                </div>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  Every basic machine instruction balances addressing mode (I), opcode (D0–D7), and effective memory target (12-bit address) in one synchronous word.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-background/60 border border-borderLine space-y-2">
                <div className="text-xs font-mono font-bold text-secondary flex items-center gap-2">
                  <Zap size={14} /> HARDWIRED TIMING & SIGNALS
                </div>
                <p className="text-xs md:text-sm text-textMuted leading-relaxed">
                  The control unit does not "think"—it relies on combinational 3-to-8 decoders and sequence counter pulses to energize the correct register gates at each nanosecond.
                </p>
              </div>
            </div>

            {/* Interactive Module Roadmap */}
            <div className="pt-2">
              <div className="text-xs font-mono text-textMuted mb-2">CURRICULUM CHAPTERS:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Binary size={12} /> 1. FORMAT
                  </div>
                  <div className="text-[10px] opacity-80">16-Bit Word</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1fd655]/10 border border-[#1fd655]/30 text-[#1fd655]">
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Clock size={12} /> 2. CYCLE
                  </div>
                  <div className="text-[10px] opacity-80">T0 - T3 Timing</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#ffcc00]/10 border border-[#ffcc00]/30 text-[#ffcc00]">
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Cpu size={12} /> 3. CONTROL
                  </div>
                  <div className="text-[10px] opacity-80">3-to-8 Decoder</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[#8b5cf6]">
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Activity size={12} /> 4. DATAPATH
                  </div>
                  <div className="text-[10px] opacity-80">ALU Execution</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center text-xs font-mono text-textMuted flex items-center justify-center gap-1.5">
              <span>Scroll down to interact with and simulate each concept</span>
              <span className="text-primary">&darr;</span>
            </div>

          </div>
        </div>

        {/* SECTION 1: 16-BIT INSTRUCTION WORD FORMAT */}
        <section id="format">
          <InstructionFormatSection />
        </section>

        {/* SECTION 2: INSTRUCTION CYCLE & TIMING */}
        <section id="cycle">
          <InstructionCycleSection />
        </section>

        {/* SECTION 3: CONTROL UNIT & 3-TO-8 DECODER */}
        <section id="control">
          <ControlUnitSection />
        </section>

        {/* SECTION 4: DATAPATH & ALU EXECUTION */}
        <section id="datapath">
          <DataPathSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}
