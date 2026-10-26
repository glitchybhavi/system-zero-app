import { useLocation, Routes, Route } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../landingPage/Navbar';
import PMSidebar from './components/PMSidebar';
import PMHeader from './components/PMHeader';
import Footer from '../../landingPage/Footer';
import ProcessManagementTheoryPage from './pages/ProcessManagementTheoryPage';
import ProcessManagementPage from './pages/ProcessManagementPage';
import ProcessManagementQuizPage from './pages/ProcessManagementQuizPage';
import '../process-synchronization/styles/theme.css';
import '../process-synchronization/styles/Layout.css';
import '../process-synchronization/styles/animations.css';

export default function ProcessManagement() {
  const location = useLocation();

  const isTheoryHub =
    location.pathname === '/learn/process-management' ||
    location.pathname === '/learn/process-management/' ||
    location.pathname === '/os/process-management' ||
    location.pathname === '/os/process-management/';

  const isQuizPage =
    location.pathname.includes('/quiz') ||
    location.pathname.includes('/exam') ||
    location.pathname.includes('/test');

  const isFullScroll = isTheoryHub || isQuizPage;

  let rootClass = 'process-sync-root';
  if (!isFullScroll) {
    rootClass = 'process-sync-root is-sim-page';
  }

  
  let footerComponent = null;
  if (isFullScroll) {
    footerComponent = <Footer />;
  }

  const { theme } = useTheme();

  return (
    <div className={`${rootClass} ${theme || 'dark'}`}>
      <Navbar />
      <div className="app-layout">
        <PMSidebar />
        <main className="main-content">
          <PMHeader />
          <div className="page-wrapper">
            <Routes>
              <Route index element={<ProcessManagementTheoryPage />} />
              <Route path="sandbox" element={<ProcessManagementPage />} />
              <Route path="quiz" element={<ProcessManagementQuizPage />} />
              <Route path="exam" element={<ProcessManagementQuizPage />} />
              <Route path="test" element={<ProcessManagementQuizPage />} />
              <Route path="*" element={<ProcessManagementTheoryPage />} />
            </Routes>
          </div>
        </main>
      </div>
      {footerComponent}
    </div>
  );
}
