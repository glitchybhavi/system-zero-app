import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ChevronDown, TerminalSquare, Cpu, Layers } from 'lucide-react';
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

  // Fixed width prevents the text from jittering as dots are added
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
  // Replaced href with our custom offline dropdown flag
  { name: 'Sandbox', sandboxMenu: true },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [hoveredNav, setHoveredNav] = useState(null);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-borderLine bg-card/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold shadow-[0_0_15px_var(--accent-primary)] transition-shadow">
            <TerminalSquare size={18} />
          </div>
          <span className="font-mono font-bold text-lg tracking-tight">
            SYSTEM<span className="text-primary">_ZERO</span>
          </span>
        </Link>

        {/* LINKS & MENUS */}
        <div className="hidden md:flex items-center gap-8 h-full">
          {NAV_LINKS.map((link) => (
            <div 
              key={link.name} 
              className="relative flex items-center h-full"
              onMouseEnter={() => setHoveredNav(link.name)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <a href={link.href || '#'} className="text-sm font-medium text-textMuted hover:text-textMain flex items-center gap-1 transition-colors cursor-pointer">
                {link.name}
                {(link.megaMenu || link.sandboxMenu) && <ChevronDown size={14} className="opacity-70" />}
              </a>

              {/* CURRICULUM MEGA DROPDOWN */}
              {link.megaMenu && (
                <AnimatePresence>
                  {hoveredNav === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] bg-card border border-borderLine rounded-2xl shadow-2xl p-6 flex gap-6"
                    >
                      {link.modules.map((mod) => (
                        <div key={mod.title} className="flex-1">
                          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-borderLine">
                            {mod.icon}
                            <h4 className="text-sm font-bold text-textMain">{mod.title}</h4>
                          </div>
                          <ul className="space-y-3">
                            {mod.topics.map((topic, i) => {
                              const title = typeof topic === 'string' ? topic : topic.title;
                              const linkPath = typeof topic === 'object' ? topic.link : (topic === 'Digital Logic & Basic Computer Structure' ? '/simulation' : null);

                              return (
                                <li key={i} className="text-xs text-textMuted hover:text-primary transition-colors flex items-center gap-2">
                                  {linkPath ? (
                                    <Link to={linkPath} className="flex items-center gap-2 hover:text-primary w-full group">
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                      <span className="font-semibold text-textMain group-hover:text-primary">{title}</span>
                                    </Link>
                                  ) : (
                                    <div className="flex items-center gap-2 cursor-default">
                                      <span className="w-1.5 h-1.5 rounded-full bg-borderLine"></span>
                                      <span>{title}</span>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* SANDBOX OFFLINE DROPDOWN */}
              {link.sandboxMenu && (
                <AnimatePresence>
                  {hoveredNav === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-16 left-1/2 -translate-x-1/2 w-[280px] bg-card border border-borderLine rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-center overflow-hidden"
                    >
                      {/* Subtle glowing radial background */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>
                      
                      <TerminalSquare size={36} className="text-textMuted mb-4 relative z-10" />
                      <h3 className="text-lg font-bold text-textMain mb-2 relative z-10">
                        Environment Offline
                      </h3>
                      <p className="text-textMuted font-mono text-xs relative z-10 tracking-wide">
                        Booting soon<BlinkingDots />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        {/* CONTROLS */}
<div className="flex items-center gap-4">
  <button onClick={toggleTheme} className="p-2 rounded-lg bg-background border border-borderLine text-textMuted hover:text-primary transition-all duration-300 hover:scale-105 shadow-sm">
    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
  </button>
  
  {/* CHANGED FROM <button> TO <Link> */}
  <Link 
    to="/simulation" 
    className="hidden md:block px-5 py-2 text-sm font-bold bg-textMain text-background hover:bg-primary hover:text-white rounded-md shadow-lg transition-colors"
  >
    Boot System
  </Link>
</div>
      </div>
    </nav>
  );
}