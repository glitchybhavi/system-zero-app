import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import Navbar from '../../../landingPage/Navbar';
import Footer from '../../../landingPage/Footer';
import ProcessSandbox from '../sandbox/ProcessSandbox';
import './ProcessManagementPage.css';

const PM_PREV_TOPIC = { title: 'Process Management Theory', route: '/learn/process-management' };
const PM_NEXT_TOPIC = { title: 'Process Synchronization', route: '/os/sync' };

export default function ProcessManagementPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  const prevTopic = PM_PREV_TOPIC;
  const nextTopic = PM_NEXT_TOPIC;

  return (
    <div className={`pm-page-root ${theme || 'dark'}`}>
      {/* Breadcrumb Navigation */}
      <nav className="pm-breadcrumb" aria-label="Breadcrumb" style={{ marginTop: '12px' }}>
        <Link to="/" className="pm-breadcrumb-link">Home</Link>
        <span className="pm-breadcrumb-sep">/</span>
        <Link to="/" className="pm-breadcrumb-link">Curriculum</Link>
        <span className="pm-breadcrumb-sep">/</span>
        <Link to="/learn/process-management" className="pm-breadcrumb-link">Process Management Theory</Link>
        <span className="pm-breadcrumb-sep">/</span>
        <span className="pm-breadcrumb-current">Simulator Sandbox</span>
      </nav>

      {/* Main Sandbox Content */}
      <ProcessSandbox />

      {/* Prev / Next Module Navigation */}
      <nav className="pm-prev-next" aria-label="Module navigation">
        <div className="pm-nav-side">
          {prevTopic ? (
            <div
              onClick={() => {
                if (prevTopic.route) {
                  navigate(prevTopic.route);
                } else {
                  showToast(`🚧 Under Progress: "${prevTopic.title}" is currently under development!`);
                }
              }}
              className="pm-nav-card pm-nav-prev"
              style={{ cursor: 'pointer' }}
            >
              <span className="pm-nav-direction">← Previous</span>
              <span className="pm-nav-title">{prevTopic.title}</span>
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className="pm-nav-side">
          {nextTopic ? (
            <div
              onClick={() => {
                if (nextTopic.route) {
                  navigate(nextTopic.route);
                } else {
                  showToast(`🚧 Under Progress: "${nextTopic.title}" is currently under development!`);
                }
              }}
              className="pm-nav-card pm-nav-next"
              style={{ cursor: 'pointer' }}
            >
              <span className="pm-nav-direction">Next →</span>
              <span className="pm-nav-title">{nextTopic.title}</span>
            </div>
          ) : (
            <div />
          )}
        </div>
      </nav>

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#38bdf8',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '8px',
          padding: '12px 20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          fontFamily: 'monospace',
          fontSize: '0.85rem',
        }}>
          {toastMessage}
        </div>
      )}

      <Footer />
    </div>
  );
}
