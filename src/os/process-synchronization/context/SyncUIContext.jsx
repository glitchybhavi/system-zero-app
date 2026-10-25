import { createContext, useState, useEffect } from 'react';

export const SyncUIContext = createContext();

export function SyncUIProvider({ children }) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(true);
  const [showGuide, setShowGuide] = useState(() => {
    const saved = localStorage.getItem('system-zero-guide');
    if (saved !== null) {
      return saved === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('system-zero-guide', String(showGuide));
  }, [showGuide]); 

  return (
    <SyncUIContext.Provider
      value={{
        isConfigOpen,
        setIsConfigOpen,
        showAuditLog,
        setShowAuditLog,
        showGuide, 
        setShowGuide,
      }}
    >
      {children}
    </SyncUIContext.Provider>
  );
}
