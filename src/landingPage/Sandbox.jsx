import { TerminalSquare } from 'lucide-react';

export default function Sandbox() {
  return (
    <section id="sandbox" className="py-32 bg-background relative z-10 px-6 border-t border-borderLine">
      <div className="max-w-7xl mx-auto text-center">
        
        <span className="font-mono text-primary font-bold tracking-widest text-sm mb-4 block uppercase">
          [ Phase 02 ]
        </span>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          The Hardware <span className="italic text-textMuted">Sandbox.</span>
        </h2>
        <p className="text-xl text-textMuted max-w-2xl mx-auto leading-relaxed mb-16">
          Write tiny programs, add multiple processes, and watch the machine juggle them in a completely unconstrained environment.
        </p>

        <div className="w-full max-w-5xl mx-auto bg-card border border-borderLine rounded-3xl p-16 md:p-24 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
          {/* Subtle glowing radial background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
          
          <TerminalSquare size={56} className="text-textMuted mb-6 relative z-10" />
          <h3 className="text-2xl md:text-3xl font-bold text-textMain mb-3 relative z-10">
            Environment Offline
          </h3>
          <p className="text-textMuted font-mono text-sm relative z-10 tracking-wide">
            System allocation scheduled for Phase 02 evaluation.
          </p>
          
          {/* Faux decorative UI elements */}
          <div className="absolute top-6 left-6 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-borderLine"></div>
            <div className="w-3 h-3 rounded-full bg-borderLine"></div>
            <div className="w-3 h-3 rounded-full bg-borderLine"></div>
          </div>
        </div>
        
      </div>
    </section>
  );
}