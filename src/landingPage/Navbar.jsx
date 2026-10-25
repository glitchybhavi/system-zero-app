import { useEffect, useState } from "react";
import {
  Sun,
  Moon,
  ChevronDown,
  TerminalSquare,
  Cpu,
  Layers,
  ArrowRight,
  CircleAlert
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { CURRICULUM_MODULES } from "./curriculumData";
import "./styles/Navbar.css";
import { Link } from "react-router-dom";

const nav_icon_size = 18;

const MODULE_ICONS = {
  cpu: <Cpu size={nav_icon_size} className="text-primary-accent" />,
  layers: <Layers size={nav_icon_size} className="text-primary-accent" />,
};

const NAV_LINKS = [
  {
    name: "Curriculum",
    fullMenu: true,
    modules: CURRICULUM_MODULES.map((mod) => ({
      ...mod,
      icon: MODULE_ICONS[mod.iconType] || <Cpu size={nav_icon_size} className="text-primary-accent" />,
    })),
  },

  { name: "Sandbox", href: "/learn/process-management/sandbox", sandboxMenu: true },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [hoveredNav, setHoveredNav] = useState(null);

  const activeLink = NAV_LINKS.find((link) => link.name === hoveredNav);
  const isOpen = Boolean(activeLink?.fullMenu || activeLink?.sandboxMenu);

  const [showToast, setShowToast] = useState(false); 

  const handleThemeClick = () => {
    setShowToast(true); 
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000); 
      return () => clearTimeout(timer); 
    }
  }, [showToast]);

  return (
    <nav className="navbar" onMouseLeave={() => setHoveredNav(null)}>
      <div className={`navbar-blur-overlay ${isOpen ? "is-open" : ""}`} />

      <div className="navbar-glass-bg"></div>

      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <TerminalSquare size={18} />
          </div>
          <span className="navbar-logo-text">
            SYSTEM<span className="text-primary-accent">_ZERO</span>
          </span>
        </Link>

        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <div key={link.name} className="navbar-item" onMouseEnter={() => setHoveredNav(link.name)}>
              {link.href?.startsWith("/") ? (
                <Link to={link.href} className={`navbar-link-btn ${hoveredNav === link.name ? 'active' : ''}`}>
                  {link.name}
                  {(link.fullMenu || link.sandboxMenu) && (
                    <ChevronDown size={15} className={`navbar-chevron ${hoveredNav === link.name ? 'rotate-180' : ''}`} />
                  )}
                </Link>
              ) : (
                <a href={link.href || "#"} className={`navbar-link-btn ${hoveredNav === link.name ? 'active' : ''}`}>
                  {link.name}
                  {(link.fullMenu || link.sandboxMenu) && (
                    <ChevronDown size={15} className={`navbar-chevron ${hoveredNav === link.name ? 'rotate-180' : ''}`} />
                  )}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="navbar-controls">
          <button onClick={handleThemeClick} aria-label="Toggle theme" className="theme-toggle-btn">
            {theme === 'dark' ? <Sun size={nav_icon_size} /> : <Moon size={nav_icon_size} />}
          </button>

          <Link to="/simulation" className="boot-system-btn">
            Boot System
          </Link>
        </div>
      </div>

      <div className={`navbar-dropdown ${isOpen ? 'is-open' : ''}`}>
        <div className="navbar-dropdown-inner">
          {activeLink?.name === 'Curriculum' && (
            <div className="curriculum-grid">
              {activeLink.modules.map((mod) => (
                <div key={mod.title} className="curriculum-module">
                  <div className="module-header">
                    {mod.icon}
                    <h4 className="module-title">{mod.title}</h4>
                  </div>
                  <ul className="topic-list">
                    {mod.topics.map((topic, i) => (
                      <li key={topic.id || i}>
                        {topic.link ? (
                          <Link to={topic.link} className="topic-link" onClick={() => setHoveredNav(null)}>
                            <span>{topic.title}</span>
                            <ArrowRight size={16} className="topic-arrow-icon" />
                          </Link>
                        ) : (
                          <div className="topic-disabled">{topic.title}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeLink?.name === 'Sandbox' && (
            <div className="sandbox-content">
              <div className="sandbox-glow" />
              <TerminalSquare size={44} className="sandbox-icon text-primary-accent" />
              <h3 className="sandbox-title">Process Management Sandbox</h3>
              <p className="sandbox-status" style={{ marginBottom: '1.25rem' }}>
                Interactive CPU scheduler, process states &amp; IPC playground
              </p>
              <Link
                to="/learn/process-management/sandbox"
                className="boot-system-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', zIndex: 10, textDecoration: 'none' }}
                onClick={() => setHoveredNav(null)}
              >
                <span>Launch Interactive Sandbox</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="theme-toast">
          <CircleAlert/>
          <span>Switching to Light mode is currently unavailable.</span>
        </div>
      )}
    </nav>
  );
}
