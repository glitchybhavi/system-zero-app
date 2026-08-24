import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './landingPage/LandingPage';
import SimulationPage from './bootSystem/SimulationPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen transition-colors duration-500 bg-background text-textMain font-sans overflow-x-clip">
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;