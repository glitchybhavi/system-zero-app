export default function Footer() {
  return (
    // Reduced pt-24 to pt-16 to kill dead space at the top
    <footer className="bg-background pt-16 pb-6 border-t border-borderLine relative z-10 flex flex-col justify-between">
      
      <div className="max-w-7xl mx-auto px-6 w-full flex-grow">
        
        {/* Top Links */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          <div className="max-w-sm">
            <div className="font-mono font-bold text-xl tracking-tight mb-4 flex items-center gap-2">
              SYSTEM<span className="text-primary">_ZERO</span>
            </div>
            <p className="text-textMuted text-sm leading-relaxed">
              Bridging the intuition gap in computer science education. Watch the machine think.
            </p>
          </div>
          
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <h5 className="font-bold text-textMain text-sm mb-1">Platform</h5>
              <a href="#" className="text-textMuted hover:text-primary transition-colors text-sm">Hardware Sandbox</a>
              <a href="#" className="text-textMuted hover:text-primary transition-colors text-sm">OS Visualizer</a>
              <a href="#" className="text-textMuted hover:text-primary transition-colors text-sm">Documentation</a>
            </div>
            <div className="flex flex-col gap-3">
              <h5 className="font-bold text-textMain text-sm mb-1">Company</h5>
              <a href="#" className="text-textMuted hover:text-primary transition-colors text-sm">About Us</a>
              <a href="https://github.com/glitchybhavi/system-zero-app.git" target="_blank" rel="noopener noreferrer" className="text-textMuted hover:text-primary transition-colors text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Typography - Fixed Clipping */}
      <div className="w-full flex justify-center mt-auto pb-8 pt-4">
        <h1 className="text-[13vw] font-black tracking-tighter leading-none text-textMain opacity-[0.04] select-none whitespace-nowrap">
          SYSTEM ZERO
        </h1>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-6 left-0 w-full px-6 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto right-0">
        <p className="text-textMuted text-xs font-medium z-20">
          &copy; 2026 System Zero. Built for developers.
        </p>
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-textMain uppercase tracking-widest bg-card/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-borderLine shadow-sm z-20">
          <div className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse shadow-[0_0_8px_#00ffcc]"></div>
          All Systems Operational
        </div>
      </div>

    </footer>
  );
}