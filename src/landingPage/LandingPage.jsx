// src/landingPage/LandingPage.jsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './Navbar';
import Hero3D from './Hero3D';
import Content from './Content';
import HardwareScroll from './HardwareScroll';
import OsVisualizer from './OsVisualizer';
import IdeView from './IdeView';
import CurriculumCards from './CurriculumCards';
import Footer from './Footer';

export default function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: false,
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