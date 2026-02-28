"use client";
import { createContext, useContext, useEffect, ReactNode } from "react";

// Light-only: theme is always "light", toggleTheme is a no-op
const ThemeContext = createContext<{ theme: "light"; toggleTheme: () => void }>({
    theme: "light",
    toggleTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.style.colorScheme = "light";
        localStorage.removeItem("theme");
    }, []);

    return (
        <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => { } }}>
            {children}
        </ThemeContext.Provider>
    );
}
