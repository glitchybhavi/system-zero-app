import { useLocation } from 'react-router-dom';

// checks the current URL using useLocation()
// It changes its category and title for the sandbox and exam routes
export default function PMHeader() {
  const { pathname } = useLocation();

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
        <h1>{title}</h1>
      </div>
    </header>
  );
}
