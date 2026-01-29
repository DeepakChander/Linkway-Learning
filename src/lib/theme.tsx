"use client";

import { createContext, useContext } from "react";

export type PageTheme = "dark" | "light";

const ThemeContext = createContext<PageTheme>("dark");

export const usePageTheme = () => useContext(ThemeContext);

export function ThemeProvider({ theme, children }: { theme: PageTheme; children: React.ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
