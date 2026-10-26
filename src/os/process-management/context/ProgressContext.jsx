import React, { createContext, useContext, useState } from 'react';

const ProgressContext = createContext({
  completedModules: {},
  markModuleCompleted: () => {},
});

export function ProgressProvider({ children }) {
  const [completedModules, setCompletedModules] = useState({
    'process-management': false,
  });

  //  sets the requested module’s value to true.
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

// a custom hook that lets a component read the shared context.
export function useProgress() {
  const context = useContext(ProgressContext);
  return context || { completedModules: {}, markModuleCompleted: () => {} };
}
