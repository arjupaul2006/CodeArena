import { createContext, useContext, useEffect, useState } from "react";
import { SettingsDataContext } from "./SettingsContext";

const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {

  const { settings, setSettings } = useContext(SettingsDataContext);

  const system = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const [theme, setTheme] = useState(() => {
    return settings?.appearance?.theme === "system"
      ? system
      : settings?.appearance?.theme || system;
  });

  useEffect(() => {
    if (!settings?.appearance?.theme) return;
    if (settings.appearance.theme === "system") {
      setTheme(system);
    } else {
      setTheme(settings.appearance.theme);
    }
  }, [settings?.appearance?.theme, system]);

  // Update the theme in localStorage and apply the class to the document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  // update the accent color in the document
  useEffect(() => {
    const accentColor =
      settings?.appearance?.accentColor?.toLowerCase() || "green";

    document.documentElement.setAttribute("data-accent", accentColor);
  }, [settings?.appearance?.accentColor]);

  const setAccent = (accentColor) => {
    const normalizedAccent = accentColor.toLowerCase();
    document.documentElement.setAttribute("data-accent", normalizedAccent);
    setSettings((current) => ({
      ...current,
      appearance: {
        ...current.appearance,
        accentColor: normalizedAccent,
      },
    }));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};

export default ThemeProvider;
