import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../landingPage/Navbar';
import Footer from '../../landingPage/Footer';
import InstructionFormatSection from './InstructionFormatSection';
import InstructionCycleSection from './InstructionCycleSection';
import ControlUnitSection from './ControlUnitSection';
import DataPathSection from './DataPathSection';
import { IsaProvider, useIsaContext } from './context/IsaContext';
import { Binary, Clock, Cpu, Activity, Zap, Layers, Settings2 } from 'lucide-react';

function IsaDesignContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeSection,
    setActiveSection,
    displayRadix,
    toggleDisplayRadix,
    clockSpeed,
    toggleClockSpeed,
  } = useIsaContext();

  // Handle URL subroute matching (e.g. /arch/isa/cycle, /arch/isa/format)
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const subRoute = pathParts[pathParts.length - 1];
    const validSections = ['format', 'cycle', 'control', 'datapath'];

    if (validSections.includes(subRoute)) {
      setActiveSection(subRoute);
      const element = document.getElementById(subRoute);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, setActiveSection]);

  // Scroll spy: Update active section as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 }
    );

    ['format', 'cycle', 'control', 'datapath'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveSection]);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    navigate(`/arch/isa/${sectionId}`);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
              
              {/* Context API Display Controls */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={toggleDisplayRadix}
                  className="px-2.5 py-1 rounded-lg border border-borderLine bg-background/60 hover:bg-card text-textMuted hover:text-textMain transition-all flex items-center gap-1.5"
                  title="Toggle Hexadecimal or Decimal display"
                >
                  <Settings2 size={12} className="text-primary" />
                  <span>RADIX: <strong className="text-primary uppercase">{displayRadix}</strong></span>
                </button>

                <button
                  type="button"
                  onClick={toggleClockSpeed}
                  className="px-2.5 py-1 rounded-lg border border-borderLine bg-background/60 hover:bg-card text-textMuted hover:text-textMain transition-all flex items-center gap-1.5"
                  title="Toggle Clock Cycle Stepping Speed"
                >
                  <span>PACE: <strong className="text-secondary">{clockSpeed / 1000}s</strong></span>
                </button>
              </div>
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

            {/* Interactive Module Navigation Roadmap (Criterion 1: React Router Navigation) */}
            <div className="pt-2">
              <div className="text-xs font-mono text-textMuted mb-2">CURRICULUM CHAPTERS:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
                
                <button
                  type="button"
                  onClick={() => handleNavClick('format')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeSection === 'format'
                      ? 'bg-[#00f2fe]/25 border-[#00f2fe] text-[#00f2fe] font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)] scale-[1.02]'
                      : 'bg-[#00f2fe]/10 border-[#00f2fe]/30 text-[#00f2fe] hover:scale-[1.01]'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Binary size={12} /> 1. FORMAT
                  </div>
                  <div className="text-[10px] opacity-80">16-Bit Word</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('cycle')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeSection === 'cycle'
                      ? 'bg-[#1fd655]/25 border-[#1fd655] text-[#1fd655] font-bold shadow-[0_0_15px_rgba(31,214,85,0.3)] scale-[1.02]'
                      : 'bg-[#1fd655]/10 border-[#1fd655]/30 text-[#1fd655] hover:scale-[1.01]'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Clock size={12} /> 2. CYCLE
                  </div>
                  <div className="text-[10px] opacity-80">T0 - T3 Timing</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('control')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeSection === 'control'
                      ? 'bg-[#ffcc00]/25 border-[#ffcc00] text-[#ffcc00] font-bold shadow-[0_0_15px_rgba(255,204,0,0.3)] scale-[1.02]'
                      : 'bg-[#ffcc00]/10 border-[#ffcc00]/30 text-[#ffcc00] hover:scale-[1.01]'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Cpu size={12} /> 3. CONTROL
                  </div>
                  <div className="text-[10px] opacity-80">3-to-8 Decoder</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('datapath')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activeSection === 'datapath'
                      ? 'bg-[#8b5cf6]/25 border-[#8b5cf6] text-[#8b5cf6] font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] scale-[1.02]'
                      : 'bg-[#8b5cf6]/10 border-[#8b5cf6]/30 text-[#8b5cf6] hover:scale-[1.01]'
                  }`}
                >
                  <div className="font-bold flex items-center justify-center gap-1">
                    <Activity size={12} /> 4. DATAPATH
                  </div>
                  <div className="text-[10px] opacity-80">ALU Execution</div>
                </button>

              </div>
            </div>

            <div className="pt-2 text-center text-xs font-mono text-textMuted flex items-center justify-center gap-1.5">
              <span>Click a chapter or scroll to simulate each concept</span>
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

        {/* FLOATING QUICK CHAPTER NAVIGATOR & CONTEXT CONTROLS */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card/90 backdrop-blur-xl border border-borderLine px-4 py-2 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.35)] flex items-center gap-1.5 md:gap-2.5 text-xs font-mono max-w-[95vw] overflow-x-auto">
          <button
            type="button"
            onClick={() => handleNavClick('format')}
            className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
              activeSection === 'format'
                ? 'bg-[#00f2fe]/20 text-[#00f2fe] font-bold border border-[#00f2fe]/40 shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            1. Format
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('cycle')}
            className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
              activeSection === 'cycle'
                ? 'bg-[#1fd655]/20 text-[#1fd655] font-bold border border-[#1fd655]/40 shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            2. Cycle
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('control')}
            className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
              activeSection === 'control'
                ? 'bg-[#ffcc00]/20 text-[#ffcc00] font-bold border border-[#ffcc00]/40 shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            3. Control
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('datapath')}
            className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
              activeSection === 'datapath'
                ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] font-bold border border-[#8b5cf6]/40 shadow-sm'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            4. Datapath
          </button>

          <span className="w-px h-4 bg-borderLine mx-0.5" />

          {/* Context controls in floating pill */}
          <button
            type="button"
            onClick={toggleDisplayRadix}
            className="px-2 py-0.5 rounded border border-borderLine bg-background/50 hover:bg-card text-textMuted hover:text-primary transition-all text-[11px] whitespace-nowrap"
            title="Toggle Hexadecimal / Decimal Display (Context API)"
          >
            {displayRadix.toUpperCase()}
          </button>
          <button
            type="button"
            onClick={toggleClockSpeed}
            className="px-2 py-0.5 rounded border border-borderLine bg-background/50 hover:bg-card text-textMuted hover:text-secondary transition-all text-[11px] whitespace-nowrap"
            title="Toggle Clock Stepping Speed (Context API)"
          >
            {clockSpeed / 1000}s
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function IsaDesignPage() {
  return (
    <IsaProvider>
      <IsaDesignContent />
    </IsaProvider>
  );
}
