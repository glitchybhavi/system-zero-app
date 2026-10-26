import { createContext, useContext, useState } from 'react';

const IsaContext = createContext();

export function IsaProvider({ children }) {
  const [activeSection, setActiveSection] = useState('format');
  const [clockSpeed, setClockSpeed] = useState(2000); // 2000ms default
  const [displayRadix, setDisplayRadix] = useState('hex'); // 'hex' | 'dec'
  const [showInfoTips, setShowInfoTips] = useState(true);

  const toggleDisplayRadix = () => {
    setDisplayRadix((prev) => (prev === 'hex' ? 'dec' : 'hex'));
  };

  const toggleClockSpeed = () => {
    setClockSpeed((prev) => (prev === 2000 ? 1000 : 2000));
  };

  // Helper function to format any address or register number into current Radix
  const formatRadix = (val) => {
    if (val === undefined || val === null) return '';
    let num = 0;
    if (typeof val === 'string') {
      if (val.startsWith('0x') || val.startsWith('0X')) {
        num = parseInt(val, 16);
      } else {
        num = parseInt(val, 10);
      }
    } else {
      num = Number(val);
    }
    if (isNaN(num)) return String(val);

    if (displayRadix === 'dec') {
      return num.toString();
    }
    return `0x${num.toString(16).toUpperCase().padStart(3, '0')}`;
  };

  const value = {
    activeSection,
    setActiveSection,
    clockSpeed,
    setClockSpeed,
    displayRadix,
    setDisplayRadix,
    toggleDisplayRadix,
    showInfoTips,
    setShowInfoTips,
    toggleClockSpeed,
    formatRadix,
  };

  return <IsaContext.Provider value={value}>{children}</IsaContext.Provider>;
}

export function useIsaContext() {
  const context = useContext(IsaContext);
  if (!context) {
    throw new Error('useIsaContext must be used within an IsaProvider');
  }
  return context;
}
