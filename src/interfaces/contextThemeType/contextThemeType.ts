import { Theme } from "@/lib/theme/theme";

export interface ThemeContextValue{
    theme: Theme,
    setTheme: (theme: Theme) => Promise<void>
}