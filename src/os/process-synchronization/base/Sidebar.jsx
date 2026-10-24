import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { pathname } = useLocation();

  const routes = [
    { path: '/os/sync', label: 'Overview Hub' },
    { path: '/os/sync/race-condition', label: 'Race Condition' },
    { path: '/os/sync/peterson', label: "Peterson's Solution" },
    { path: '/os/sync/mutex', label: 'Mutex Lock' },
    { path: '/os/sync/semaphore', label: 'Counting Semaphore' },
  ];

  const links = [];
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    let isActive = false;
    if (route.path === '/os/sync') {
      if (pathname === '/os/sync' || pathname === '/os/sync/') {
        isActive = true;
      }
    } else if (pathname.startsWith(route.path)) {
      isActive = true;
    }

    let linkClass = 'nav-link';
    if (isActive) {
      linkClass = 'nav-link active';
    }

    links.push(
      <Link key={route.path} to={route.path} className={linkClass}>
        <span>{route.label}</span>
      </Link>
    );
  }

  return (
    <aside className="sidebar">
      <section>
        <header className="sidebar-section-label">Process Synchronization</header>
        <nav className="nav-menu">{links}</nav>
      </section>
    </aside>
  );
}
