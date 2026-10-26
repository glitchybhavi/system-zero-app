import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import Navbar from '../../../landingPage/Navbar';
import Footer from '../../../landingPage/Footer';
import KnowledgeQuiz from '../components/KnowledgeQuiz';
import { ProgressProvider } from '../context/ProgressContext';
import './ProcessManagementQuizPage.css';

export default function ProcessManagementQuizPage() {
  const { theme } = useTheme();

  return (
    <ProgressProvider>
      <div className={`pm-quiz-page-root ${theme || 'dark'}`}>
        {/* Hero Header */}
        <header className="pm-quiz-hero">
          <div className="pm-quiz-hero-container">
            <nav className="pm-breadcrumb" aria-label="Breadcrumb">
              <Link to="/" className="pm-breadcrumb-link">Home</Link>
              <span className="pm-breadcrumb-sep">/</span>
              <Link to="/" className="pm-breadcrumb-link">Curriculum</Link>
              <span className="pm-breadcrumb-sep">/</span>
              <Link to="/learn/process-management" className="pm-breadcrumb-link">Process Management</Link>
              <span className="pm-breadcrumb-sep">/</span>
              <span className="pm-breadcrumb-current">Final Diagnostic Exam</span>
            </nav>

            <span className="pm-quiz-badge font-mono">MODULE 06 EVALUATION</span>
            <h1 className="pm-quiz-hero-title">Process Management Collective Exam</h1>
            <p className="pm-quiz-hero-lead">
              Test your complete mastery across all 8 subtopics: Process Isolation, Memory Segments, 
              PCB Fields, 5-State Model, fork &amp; exec, Zombie/Orphan handling, Context Switching Overhead, 
              and IPC Concurrency.
            </p>

            <div className="pm-quiz-meta-strip font-mono">
              <span className="pm-quiz-meta-item">📝 12 Multi-Choice Questions</span>
              <span className="pm-quiz-meta-item">🎯 Passing Grade: ≥ 60% (8/12)</span>
              <span className="pm-quiz-meta-item">🏆 Rewards: Module Completion Badge</span>
            </div>
          </div>
        </header>

        {/* Main Container with Collective KnowledgeQuiz Form */}
        <main className="pm-quiz-main-container">
          <KnowledgeQuiz />

          {/* Navigation back to Theory or Simulator */}
          <div className="pm-quiz-nav-row font-mono">
            <Link to="/learn/process-management" className="pm-quiz-back-btn">
              ← Return to Theory Notes
            </Link>
            <Link to="/learn/process-management/sandbox" className="pm-quiz-sim-btn">
              ⚡ Open Interactive Simulator Sandbox →
            </Link>
          </div>
        </main>
      </div>
    </ProgressProvider>
  );
}
