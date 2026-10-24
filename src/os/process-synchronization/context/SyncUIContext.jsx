import { createContext, useState } from 'react';

export const SyncUIContext = createContext();

export function SyncUIProvider({ children }) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(true);

  return (
    <SyncUIContext.Provider
      value={{
        isConfigOpen,
        setIsConfigOpen,
        showAuditLog,
        setShowAuditLog,
      }}
    >
      {children}
    </SyncUIContext.Provider>
  );
}
