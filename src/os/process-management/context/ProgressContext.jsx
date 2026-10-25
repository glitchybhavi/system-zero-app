import React, { createContext, useContext, useState } from 'react';

const ProgressContext = createContext({
  completedModules: {},
  markModuleCompleted: () => {},
});

export function ProgressProvider({ children }) {
  const [completedModules, setCompletedModules] = useState({
    'process-management': false,
  });

  const markModuleCompleted = (moduleId) => {
    setCompletedModules((prev) => ({
      ...prev,
      [moduleId]: true,
    }));
  };

  return (
    <ProgressContext.Provider value={{ completedModules, markModuleCompleted }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  return context || { completedModules: {}, markModuleCompleted: () => {} };
}
