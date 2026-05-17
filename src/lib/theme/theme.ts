export const THEMES = ["LIGHT", "DARK"] as const

export type Theme = typeof THEMES[number]

export const DEFAULT_THEME: Theme = "DARK"

export function isValidTheme(value: unknown): value is Theme {
    return typeof value === "string" && ((THEMES as readonly string[]).includes(value))
}