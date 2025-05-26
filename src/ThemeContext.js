import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// This function is used both in React component and direct script execution
const updateCssVariables = (isDarkMode) => {
  const root = document.querySelector(':root');
  const theme = {
    dark: {
      '--bg-color': '#04041a',
      '--text-color': '#bcc2ef',
      '--main-color': '#ff002f'
    },
    light: {
      '--bg-color': '#c2c7f0',
      '--text-color': '#04041a',
      '--main-color': '#ff002f'
    }
  };
  
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  Object.entries(currentTheme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

// Script to add to <head> that sets theme immediately before page renders
const injectThemeScript = () => {
  // Only run once on mount
  if (document.getElementById('theme-script')) return;
  
  const script = document.createElement('script');
  script.id = 'theme-script';
  script.innerHTML = `
    (function() {
      try {
        // Check if user has a saved preference
        var savedMode = localStorage.getItem('darkMode');
        var prefersDark = savedMode === 'true' || 
                         (savedMode === null && 
                          window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        // Set default to dark if preference not found
        var isDarkMode = savedMode !== null ? (savedMode === 'true') : true;
        
        // Update CSS variables immediately
        var root = document.querySelector(':root');
        var theme = {
          dark: {
            '--bg-color': '#04041a',
            '--text-color': '#bcc2ef',
            '--main-color': '#ff002f'
          },
          light: {
            '--bg-color': '#c2c7f0',
            '--text-color': '#04041a',
            '--main-color': '#ff002f'
          }
        };
        
        var currentTheme = isDarkMode ? theme.dark : theme.light;
        Object.entries(currentTheme).forEach(function(entry) {
          root.style.setProperty(entry[0], entry[1]);
        });
        
        // Add a class to body to help with other style adjustments
        document.body.classList.toggle('dark-mode', isDarkMode);
      } catch(e) {
        console.error('Theme initialization error:', e);
      }
    })();
  `;
  
  // Insert script into head
  document.head.appendChild(script);
};

const ThemeProvider = ({ children }) => {
  // Get initial state from localStorage (matching the script logic)
  const getInitialDarkMode = () => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Default to dark mode if no preference is saved
    return true;
  };
  
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  
  // Inject theme script on mount
  useEffect(() => {
    injectThemeScript();
  }, []);
  
  // Update the theme when darkMode changes
  useEffect(() => {
    updateCssVariables(darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };