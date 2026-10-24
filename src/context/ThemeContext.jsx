import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = 'dark'; 
  
  useEffect(() => {
    const root = window.document.documentElement; 
    root.classList.add("dark");
    root.classList.remove("light"); 
    localStorage.setItem("system-zero-theme", "dark"); 
  }, [])
  
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);


// Light Mode toggle for later addition

// const [theme, setTheme] = useState(() => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('system-zero-theme') || 'dark';
//   }
//   return 'dark';
// });


// useEffect(() => {
//   const root = window.document.documentElement;
//   if (theme === 'dark') {
//     root.classList.add('dark');
//     root.classList.remove('light');
//   } else {
//     root.classList.add('light');
//     root.classList.remove('dark');
//   }
//   localStorage.setItem('system-zero-theme', theme);
// }, [theme]);

// const toggleTheme = () => {
  //   setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  // };