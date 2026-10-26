import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// checks the current URL using useLocation()
// It changes its category and title for the sandbox and exam routes
export default function PMHeader() {
  const { pathname } = useLocation();
  const { isExamPassed, examScore, totalQuestions } = useSelector(
    (state) => state.processManagement || {}
  );

  let category = 'Process Management';
  let title = 'Overview Hub';

  if (pathname.includes('sandbox')) {
    category = 'Interactive Simulation';
    title = 'Process Sandbox';
  } else if (pathname.includes('quiz') || pathname.includes('exam') || pathname.includes('test')) {
    category = 'Module Evaluation';
    title = 'Diagnostic Final Exam';
  }

  return (
    <header className="header">
      <div className="header-title-group">
        <span className="header-category-label">{category}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h1>{title}</h1>
          {examScore !== null && (
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '6px',
                backgroundColor: isExamPassed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: isExamPassed ? '#10b981' : '#f87171',
                border: `1px solid ${isExamPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              {isExamPassed ? '🏆 Exam Passed' : '📝 Exam Score'}: {examScore}/{totalQuestions}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
