import { useLocation, Routes, Route } from 'react-router-dom';
import Navbar from '../../landingPage/Navbar';
import Sidebar from './base/Sidebar';
import Header from './base/Header';
import Footer from '../../landingPage/Footer';
import ProcessSyncHub from './pages/ProcessSyncHub';
import RaceConditionPage from './pages/RaceConditionPage';
import PetersonPage from './pages/PetersonPage';
import MutexPage from './pages/MutexPage';
import SemaphorePage from './pages/SemaphorePage';
import { SyncUIProvider } from './context/SyncUIContext';
import './styles/theme.css';
import './styles/Layout.css';
import './styles/animations.css';

export default function ProcessSync() {
  const location = useLocation();
  const isTheoryHub = location.pathname === '/os/sync' || location.pathname === '/os/sync/';

  let rootClass = 'process-sync-root';
  if (!isTheoryHub) {
    rootClass = 'process-sync-root is-sim-page';
  }

  let footerComponent = null;
  if (isTheoryHub) {
    footerComponent = <Footer />;
  }

  return (
    <SyncUIProvider>
      <div className={rootClass}>
        <Navbar />
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Header />
            <div className="page-wrapper">
              <Routes>
                <Route index element={<ProcessSyncHub />} />
                <Route path="race-condition" element={<RaceConditionPage />} />
                <Route path="peterson" element={<PetersonPage />} />
                <Route path="mutex" element={<MutexPage />} />
                <Route path="semaphore" element={<SemaphorePage />} />
                <Route path="*" element={<ProcessSyncHub />} />
              </Routes>
            </div>
          </main>
        </div>
        {footerComponent}
      </div>
    </SyncUIProvider>
  );
}
