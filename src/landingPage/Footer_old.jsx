export default function Footer() {
  return (
    <footer className="bg-background dark:bg-black pt-16 pb-6 border-t border-borderLine relative z-10 flex flex-col justify-between font-['Segoe_UI',-apple-system,BlinkMacSystemFont,'SF_Pro_Display',Roboto,sans-serif]">
      
      <div className="max-w-7xl mx-auto px-6 w-full flex-grow">
        
        {/* Top Links */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          <div className="max-w-sm">
            <div className="font-black text-2xl tracking-tight text-textMain mb-4 flex items-center gap-2">
              Execute The Theory.
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
          &copy; 2026 System Zero.
        </p>
      </div>

    </footer>
  );
}