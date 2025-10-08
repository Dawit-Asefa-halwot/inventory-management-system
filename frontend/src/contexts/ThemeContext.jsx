import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
     const [theme, setTheme] = useState(() => {
          const saved = localStorage.getItem('theme');
          return saved || 'light';
     });

     const [language, setLanguage] = useState(() => {
          const saved = localStorage.getItem('language');
          return saved || 'en';
     });

     useEffect(() => {
          localStorage.setItem('theme', theme);
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(theme);
     }, [theme]);

     useEffect(() => {
          localStorage.setItem('language', language);
     }, [language]);

     const toggleTheme = () => {
          setTheme(prev => prev === 'light' ? 'dark' : 'light');
     };

     const changeLanguage = (newLanguage) => {
          setLanguage(newLanguage);
     };

     const value = {
          theme,
          language,
          toggleTheme,
          changeLanguage,
          setTheme
     };

     return (
          <ThemeContext.Provider value={value}>
               {children}
          </ThemeContext.Provider>
     );
};

export const useTheme = () => {
     const context = useContext(ThemeContext);
     if (!context) {
          throw new Error('useTheme must be used within a ThemeProvider');
     }
     return context;
};
