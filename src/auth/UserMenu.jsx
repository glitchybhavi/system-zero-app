import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Cpu, TerminalSquare, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './styles/Auth.css';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  return (
    <div className="nav-user-container" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="nav-user-chip"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account menu"
      >
        <span className="user-avatar-badge">{user.avatar || 'SZ'}</span>
        <span className="user-name-text">{user.name.split(' ')[0]}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="nav-user-dropdown" role="menu">
          <div className="user-dropdown-header">
            <div className="flex items-center justify-between">
              <span className="user-dropdown-name">{user.name}</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-mono">
                <CheckCircle size={10} /> Active
              </span>
            </div>
            <div className="user-dropdown-email">{user.email}</div>
            <div className="user-dropdown-role">{user.role}</div>
          </div>

          <div className="user-dropdown-links">
            <Link
              to="/simulation"
              className="user-dropdown-link"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <Cpu size={15} className="text-primary-accent shrink-0" />
              <span>Digital Logic Simulation</span>
            </Link>

            <Link
              to="/learn/process-management/sandbox"
              className="user-dropdown-link"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <TerminalSquare size={15} className="text-primary-accent shrink-0" />
              <span>Process Sandbox</span>
            </Link>

            <Link
              to="/arch/isa"
              className="user-dropdown-link"
              onClick={() => setIsOpen(false)}
              role="menuitem"
            >
              <Shield size={15} className="text-primary-accent shrink-0" />
              <span>ISA &amp; CPU Design</span>
            </Link>
          </div>

          <div className="user-dropdown-divider" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="user-logout-btn"
            role="menuitem"
          >
            <LogOut size={15} />
            <span>Sign Out Session</span>
          </button>
        </div>
      )}
    </div>
  );
}
