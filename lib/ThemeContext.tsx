import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [isMounted, setIsMounted] = useState(false);

    // On mount, read from localStorage; default to 'dark'
    useEffect(() => {
        const stored = localStorage.getItem('cr-theme') as Theme | null;
        if (stored) {
            setThemeState(stored);
        }
        setIsMounted(true);
    }, []);

    // Apply theme to DOM and listen for system preference changes
    useEffect(() => {
        if (!isMounted) return;

        const htmlElement = document.documentElement;

        const applyTheme = (t: Theme) => {
            // Remove any existing theme classes first to ensure clean switch
            htmlElement.classList.remove('dark', 'light');

            if (t === 'system') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                htmlElement.classList.toggle('dark', isDark);
                console.log('[ThemeContext] System theme applied. dark class:', isDark, htmlElement.classList);
            } else {
                htmlElement.classList.toggle('dark', t === 'dark');
                console.log('[ThemeContext] Manual theme applied:', t, 'dark class present:', htmlElement.classList.contains('dark'));
            }
        };

        applyTheme(theme);
        localStorage.setItem('cr-theme', theme);

        // If system mode, listen for OS theme changes
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => applyTheme('system');
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [theme, isMounted]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }
    return context;
};
