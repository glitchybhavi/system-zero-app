import { useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();

  let category = 'Process Synchronization';
  let title = 'Overview Hub';

  if (pathname.includes('race-condition')) {
    category = 'Concurrency Anomaly';
    title = 'The Lost Update Problem';
  } else if (pathname.includes('peterson')) {
    category = 'Software Synchronization';
    title = "Peterson's Algorithm";
  } else if (pathname.includes('mutex')) {
    category = 'Hardware Synchronization';
    title = 'Mutex Locks';
  } else if (pathname.includes('semaphore')) {
    category = 'Signaling Mechanisms';
    title = 'Counting Semaphores';
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
