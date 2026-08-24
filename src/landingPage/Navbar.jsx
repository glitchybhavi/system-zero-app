import { useState, useEffect } from 'react';
import { Sun, Moon, ChevronDown, TerminalSquare, Cpu, Layers, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

// Custom component for the animated 1-by-1 dots
const BlinkingDots = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return <span className="inline-block w-4 text-left">{dots}</span>;
};

const NAV_LINKS = [
  {
    name: 'Curriculum',
    megaMenu: true,
    modules: [
      {
        title: 'Computer Organization',
        icon: <Cpu size={18} className="text-primary" />,
        topics: [
          { title: 'Digital Logic & Basic Computer Structure', link: '/simulation' },
          { title: 'Instruction Set Architecture & CPU Design' },
          { title: 'Computer Arithmetic & Data Path' },
          { title: 'Memory Organization & Hierarchy' },
          { title: 'Input/Output (I/O) & Parallel Processing' }
        ]
      },
      {
        title: 'Operating Systems',
        icon: <Layers size={18} className="text-primary" />,
        topics: [
          { title: 'Overview' },
          { title: 'Process Management' },
          { title: 'Process Coordination' },
          { title: 'Memory Management' },
          { title: 'Storage Management' },
          { title: 'Case Studies' }
        ]
      }
    ]
  },
  { name: 'Sandbox', sandboxMenu: true },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [hoveredNav, setHoveredNav] = useState(null);

  const activeLink = NAV_LINKS.find((link) => link.name === hoveredNav);
  const isOpen = Boolean(activeLink && (activeLink.megaMenu || activeLink.sandboxMenu));

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]"
      onMouseLeave={() => setHoveredNav(null)}
    >
      {/* 
        PAGE BLUR OVERLAY
        Fades in over the rest of the website to focus attention on the menu 
      */}
      <div
        className={`fixed inset-0 h-screen w-screen bg-background/40 backdrop-blur-sm transition-opacity duration-500 pointer-events-none -z-10 ${isOpen ? 'opacity-100' : 'opacity-0'
          }`}
      />

      {/* Glassmorphism Background layer for the top bar */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl z-10 transition-colors duration-300"></div>

      <div className="relative z-30 max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-[0_0_15px_var(--accent-primary)] transition-shadow">
            <TerminalSquare size={18} />
          </div>
          <span className="font-mono font-bold text-lg tracking-tight">
            SYSTEM<span className="text-primary">_ZERO</span>
          </span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-10 h-full">
          {NAV_LINKS.map((link) => (
            <div
              key={link.name}
              className="relative flex items-center h-full"
              onMouseEnter={() => setHoveredNav(link.name)}
            >
              <a
                href={link.href || '#'}
                className={`text-[15px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${hoveredNav === link.name ? 'text-textMain' : 'text-textMuted hover:text-textMain'}`}
              >
                {link.name}
                {(link.megaMenu || link.sandboxMenu) && (
                  <ChevronDown
                    size={15}
                    className={`opacity-70 transition-transform duration-300 ${hoveredNav === link.name ? 'rotate-180' : 'rotate-0'}`}
                  />
                )}
              </a>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-4 relative z-30">
          <button onClick={toggleTheme} className="p-2 rounded-lg bg-background/50 border border-borderLine/50 text-textMuted hover:text-primary transition-all duration-300 hover:scale-105 shadow-sm">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/simulation"
            className="hidden md:block px-5 py-2 text-sm font-bold bg-textMain text-background hover:bg-primary hover:text-white rounded-lg shadow-lg transition-all active:scale-95"
          >
            Boot System
          </Link>
        </div>
      </div>

      {/* APPLE-STYLE EXPANDED DROPDOWN (Same background as page) */}
      <div
        className={`absolute top-16 left-0 w-full bg-background overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-20 ${
          isOpen ? 'max-h-[520px] opacity-100 shadow-2xl' : 'max-h-0 opacity-0 shadow-none pointer-events-none'
        }`}
      >
        <div className={`max-w-7xl mx-auto px-8 py-10 transition-all duration-500 delay-75 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>

          {/* CURRICULUM MEGA DROPDOWN */}
          {activeLink?.name === 'Curriculum' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
              {activeLink.modules.map((mod) => (
                <div key={mod.title} className="flex flex-col">
                  {/* Category Label */}
                  <div className="flex items-center gap-2 mb-6">
                    {mod.icon}
                    <h4 className="text-xs font-bold uppercase tracking-wider text-textMuted">
                      {mod.title}
                    </h4>
                  </div>

                  <ul className="space-y-3.5">
                    {mod.topics.map((topic, i) => {
                      const title = typeof topic === 'string' ? topic : topic.title;
                      const linkPath = typeof topic === 'object' ? topic.link : (topic === 'Digital Logic & Basic Computer Structure' ? '/simulation' : null);

                      return (
                        <li key={i}>
                          {linkPath ? (
                            <Link
                              to={linkPath}
                              className="group flex items-center justify-between text-lg font-bold text-textMain hover:text-primary transition-colors tracking-tight"
                            >
                              <span>{title}</span>
                              <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                            </Link>
                          ) : (
                            <div className="text-[15px] font-medium text-textMuted/80 hover:text-textMain transition-colors cursor-default">
                              {title}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* SANDBOX DROPDOWN */}
          {activeLink?.name === 'Sandbox' && (
            <div className="flex flex-col items-center justify-center text-center py-10 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>

              <TerminalSquare size={44} className="text-textMuted mb-4 relative z-10" />
              <h3 className="text-2xl font-bold tracking-tight text-textMain mb-2 relative z-10">
                Environment Offline
              </h3>
              <p className="text-textMuted font-mono text-sm relative z-10 tracking-wide">
                Booting soon<BlinkingDots />
              </p>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}