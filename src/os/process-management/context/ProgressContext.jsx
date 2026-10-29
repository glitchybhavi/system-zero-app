import React, { createContext, useContext, useState } from 'react';

const ProgressContext = createContext({
  completedModules: {},
  markModuleCompleted: () => {},
});

export function ProgressProvider({ children }) {
  // Read saved completion state from localStorage on initial load
  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem('systemzero_completed_modules');
      return saved ? JSON.parse(saved) : { 'process-management': false };
    } catch {
      return { 'process-management': false };
    }
  });

  // Sets the requested module's value to true and persists to localStorage
  const markModuleCompleted = (moduleId) => {
    setCompletedModules((prev) => {
      const updated = { ...prev, [moduleId]: true };
      try {
        localStorage.setItem('systemzero_completed_modules', JSON.stringify(updated));
      } catch {
        // Silently fallback if localStorage is disabled
      }
      return updated;
    });
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
