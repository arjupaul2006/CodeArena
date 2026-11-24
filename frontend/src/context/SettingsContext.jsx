import axios from "axios";
import React, { useEffect, useState } from "react";
import { createContext } from "react";

export const SettingsDataContext = createContext();

const SettingsContext = ({ children }) => {
  const [settings, setSettings] = useState({
    editor: {
      theme: "vs-dark",
      fontFamily: "Fira Code",
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
      letterSpacing: 0,
      tabSize: 4,
      wordWrap: "off",
      minimap: false,
      lineNumbers: "on",
      folding: true,
      autoIndent: "full",
      autoClosingBrackets: "always",
      formatOnPaste: true,
      formatOnType: false,
      matchBrackets: "always",
      cursorStyle: "line",
      smoothScrolling: true,
      fontLigatures: true,
      defaultLanguage: "cpp",
    },
    appearance: {
      theme: "dark",
      accentColor: "green",
      density: "comfortable",
      sidebarCollapsed: false,
      animations: true,
    },
    notifications: {
      contestReminders: true,
      contestAnnouncements: true,
      contestResults: true,
      leaderboardUpdates: false,
      newProblems: true,
      platformAnnouncements: true,
      securityAlerts: true,
      weeklyProgressReport: false,
      productUpdates: false,
    },
  });

  // get all settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const response = await axios.get(
          `${backendUrl}/api/settings/getAllSettings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        console.log("Fetched settings:", response.data);
        const fetchedPreferences = response.data || {};
        setSettings(fetchedPreferences);       
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsDataContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsDataContext.Provider>
  );
};

export default SettingsContext;
