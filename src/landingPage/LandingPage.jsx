// src/landingPage/LandingPage.jsx
import Navbar from './Navbar';
import Hero3D from './Hero3D';
import HardwareScroll from './HardwareScroll';
import OsVisualizer from './OsVisualizer';
import IdeView from './IdeView';
import CurriculumCards from './CurriculumCards';
import Footer from './Footer';
import Content from './Content';

export default function LandingPage() {
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