import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
     theme: 'light',
     toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
     const [theme, setTheme] = useState(() => {
          const savedTheme = localStorage.getItem('theme');
          return savedTheme ||
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
     });

     useEffect(() => {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(theme);
          localStorage.setItem('theme', theme);
     }, [theme]);

     const toggleTheme = () => {
          setTheme(prev => prev === 'light' ? 'dark' : 'light');
     };

     return (
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
               {children}
          </ThemeContext.Provider>
     );
};
