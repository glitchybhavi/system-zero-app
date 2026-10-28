import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';

// Displays navigation links and highlights the current section
export default function PMSidebar() {
  const { pathname } = useLocation();
  const { completedModules } = useProgress();
  const isModuleDone = Boolean(completedModules?.['process-management']);

  const routes = [
    { path: '/learn/process-management', label: 'Overview Hub' },
    { path: '/learn/process-management/sandbox', label: 'Simulator Sandbox' },
    { path: '/learn/process-management/quiz', label: 'Final Exam', badge: isModuleDone ? '✓ Passed' : null },
  ];

  const links = [];
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    let isActive = false;
    if (route.path === '/learn/process-management') {
      if (
        pathname === '/learn/process-management' ||
        pathname === '/learn/process-management/' ||
        pathname === '/os/process-management' ||
        pathname === '/os/process-management/'
      ) {
        isActive = true;
      }
    } else if (
      (route.path.includes('sandbox') && pathname.includes('sandbox')) ||
      (route.path.includes('quiz') && (pathname.includes('quiz') || pathname.includes('exam') || pathname.includes('test')))
    ) {
      isActive = true;
    }


    let linkClass = 'nav-link';
    if (isActive) {
      linkClass = 'nav-link active';
    }

    links.push(
      <Link key={route.path} to={route.path} className={linkClass}>
        <span>{route.label}</span>
        {route.badge && (
          <span style={{
            marginLeft: 'auto',
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            fontWeight: 700,
          }}>
            {route.badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <aside className="sidebar">
      <section>
        <header className="sidebar-section-label">Process Management</header>
        <nav className="nav-menu">{links}</nav>
      </section>
    </aside>
  );
}
