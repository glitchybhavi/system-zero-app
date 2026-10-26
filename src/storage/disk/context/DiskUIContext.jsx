import { createContext, useContext, useState } from 'react';

const DiskUIContext = createContext();

export function DiskUIProvider({ children }) {
  const [activeLab, setActiveLab] = useState('platter');
  const [seekSpeed, setSeekSpeed] = useState(1300); // 1300ms default auto-play delay
  const [platterRpm, setPlatterRpm] = useState('7200'); // '7200' | '10000'
  const [showGhostTrajectory, setShowGhostTrajectory] = useState(true);

  const toggleSeekSpeed = () => {
    setSeekSpeed((prev) => (prev === 1300 ? 600 : 1300));
  };

  const togglePlatterRpm = () => {
    setPlatterRpm((prev) => (prev === '7200' ? '10000' : '7200'));
  };

  const toggleGhostTrajectory = () => {
    setShowGhostTrajectory((prev) => !prev);
  };

  const value = {
    activeLab,
    setActiveLab,
    seekSpeed,
    setSeekSpeed,
    toggleSeekSpeed,
    platterRpm,
    setPlatterRpm,
    togglePlatterRpm,
    showGhostTrajectory,
    setShowGhostTrajectory,
    toggleGhostTrajectory,
  };

  return <DiskUIContext.Provider value={value}>{children}</DiskUIContext.Provider>;
}

export function useDiskUI() {
  const context = useContext(DiskUIContext);
  if (!context) {
    throw new Error('useDiskUI must be used within a DiskUIProvider');
  }
  return context;
}
