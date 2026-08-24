// src/landingPage/LandingPage.jsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './Navbar';
import Hero3D from './Hero3D';
import HardwareScroll from './HardwareScroll';
import OsVisualizer from './OsVisualizer';
import IdeView from './IdeView';
import CurriculumCards from './CurriculumCards';
import Footer from './Footer';
import Content from './Content';

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.75,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero3D />
        <Content />
        <HardwareScroll />
        <OsVisualizer />
        <CurriculumCards />
        <IdeView />
      </main>
      <Footer />
    </>
  );
}