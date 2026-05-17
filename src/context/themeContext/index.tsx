"use client"

import { saveThemeAction } from "@/app/actions";
import { ThemeContextValue } from "@/interfaces/contextThemeType/contextThemeType";
import { Theme } from "@/lib/theme/theme";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";


const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({children, initialTheme}: {children: ReactNode, initialTheme: Theme}) {
    const [themeSite, setThemeSite] = useState<Theme>(initialTheme);

    const setTheme = useCallback(async (newTheme: Theme) => {
        const prevTheme = themeSite

        document.documentElement.setAttribute("data-theme", newTheme)
        setThemeSite(newTheme)

        try {
            await saveThemeAction(newTheme)
        } catch (error) {
            document.documentElement.setAttribute("data-theme", prevTheme)
            setThemeSite(prevTheme)
            throw new Error("Failed to save Theme")
        }
    }, [themeSite]);

    return (
        <ThemeContext value={{theme: themeSite, setTheme}}>
            {children}
        </ThemeContext>
    )
};

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if(!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
};