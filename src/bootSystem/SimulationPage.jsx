import { useEffect } from 'react';
import MotherboardHook from './MotherboardHook';
import CpuRegisters from './CpuRegisters';
import CpuAlu from './CpuAlu';
import CpuFinalLeap from './CpuFinalLeap';
import Navbar from '../landingPage/Navbar';
import Footer from '../landingPage/Footer';

export default function SimulationPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-background text-textMain">
      <Navbar/>
      <MotherboardHook />
      <CpuRegisters />
      <CpuAlu />
      <CpuFinalLeap />
      <Footer />
    </div>
  );
}