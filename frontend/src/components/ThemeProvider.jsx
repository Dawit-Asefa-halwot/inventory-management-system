import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
     theme: 'light',
     toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
     const [theme, setTheme] = useState(() => {
          const savedTheme = localStorage.getItem('theme');
          if (savedTheme) return savedTheme;
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
     });

     useEffect(() => {
          const storedTheme = localStorage.getItem('theme');
          if (storedTheme === 'dark') {
               document.documentElement.classList.add('dark');
          } else {
               document.documentElement.classList.remove('dark');
          }
     }, []);


     const toggleTheme = () => {
          const root = document.documentElement;
          const isDark = root.classList.contains('dark');

          if (isDark) {
               root.classList.remove('dark');
               localStorage.setItem('theme', 'light');
          } else {
               root.classList.add('dark');
               localStorage.setItem('theme', 'dark');
          }
     };

     return (
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
               {children}
          </ThemeContext.Provider>
     );
};
