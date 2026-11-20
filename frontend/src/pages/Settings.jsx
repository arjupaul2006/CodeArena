import { useContext, useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import Sidebar from "../components/problems/SideBar";
import TopNav from "../components/problems/TopNav";
import AccountSettings from "../components/settings/AccountSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import EditorPreferences from "../components/settings/EditorPreferences";
import NotificationSettings from "../components/settings/NotificationSettings";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import {
  defaultPreferences,
  notificationKeys,
  settingsSections,
} from "../components/settings/settingsData";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { SettingsDataContext } from "../context/SettingsContext";

export default function Settings() {
  const { user, setUser } = useContext(UserDataContext);
  const {settings, setSettings} = useContext(SettingsDataContext);
  const [activeSection, setActiveSection] = useState("account");
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profileImage: user?.profileImage || "",
  });
  const [saved, setSaved] = useState(false);
  const currentSection = useMemo(
    () =>
      settingsSections.find((section) => section.id === activeSection) ||
      settingsSections[0],
    [activeSection],
  );

  const [editorData, setEditorData] = useState({
    theme: defaultPreferences.editorTheme,
    fontFamily: defaultPreferences.fontFamily,
    fontSize: defaultPreferences.fontSize,
    fontWeight: defaultPreferences.fontWeight,
    lineHeight: defaultPreferences.lineHeight,
    letterSpacing: defaultPreferences.letterSpacing,
    tabSize: defaultPreferences.tabSize,
    wordWrap: defaultPreferences.wordWrap,
    minimap: defaultPreferences.minimap,
    lineNumbers: defaultPreferences.lineNumbers,
    folding: defaultPreferences.folding,
    autoIndent: defaultPreferences.autoIndent,
    autoClosingBrackets: defaultPreferences.autoClosingBrackets,
    formatOnPaste: defaultPreferences.formatOnPaste,
    formatOnType: defaultPreferences.formatOnType,
    matchBrackets: defaultPreferences.matchBrackets,
    cursorStyle: defaultPreferences.cursorStyle,
    smoothScrolling: defaultPreferences.smoothScrolling,
    fontLigatures: defaultPreferences.fontLigatures,
    defaultLanguage: defaultPreferences.defaultLanguage,
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
        setPreferences(fetchedPreferences);
        setSettings(fetchedPreferences);
        if (fetchedPreferences.editor) {
          setEditorData((current) => ({
            ...current,
            ...fetchedPreferences.editor,
          }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const setNotificationGroup = (enabled) => {
    setPreferences((current) => ({
      ...current,
      ...Object.fromEntries(notificationKeys.map((key) => [key, enabled])),
    }));
    setSaved(false);
  };

  // Save settings to mongodb and update user context
  const handleSave = async () => {
    try {
      setPreferences((current) => ({ ...current, editor: editorData }));
      setSettings((current) => ({ ...current, editor: editorData }));
      setUser((current) => ({ ...current, ...profile }));

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const response = await axios.post(
        `${backendUrl}/api/settings/updateSettings`,
        {
          preferences: {
            ...preferences,
            editor: editorData,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log("Settings saved:", response.data);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Unable to save settings:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#e8f3e8] font-sans text-[#244333] antialiased">
      <Sidebar />
      <div className="min-w-0 flex-1 pb-20 md:pl-64 md:pb-0">
        <TopNav />
        <main className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6 lg:p-8">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#3f7d55]">
              CodeArena Settings
            </p>
            <h1 className="text-2xl font-black tracking-tight text-[#183226] sm:text-3xl">
              Make CodeArena yours
            </h1>
            <p className="mt-2 text-sm text-[#668170]">
              Manage your account, editor, appearance, and notifications in one
              place.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
            <SettingsSidebar
              sections={settingsSections}
              activeSection={activeSection}
              onSelect={setActiveSection}
            />
            <section className="rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-5 shadow-lg sm:p-7">
              <div className="mb-5 flex items-start gap-3 border-b border-[#d5e7d7] pb-5">
                <div className="rounded-xl bg-[#dcecdf] p-2 text-[#3f7d55]">
                  <SettingsIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#183226]">
                    {currentSection.label}
                  </h2>
                  <p className="mt-1 text-sm text-[#668170]">
                    {currentSection.description}
                  </p>
                </div>
              </div>
              {activeSection === "account" && (
                <AccountSettings profile={profile} setProfile={setProfile} />
              )}
              {activeSection === "editor" && (
                <EditorPreferences
                  editorData={editorData}
                  setEditorData={setEditorData}
                />
              )}
              {activeSection === "appearance" && (
                <AppearanceSettings
                  preferences={preferences}
                  updatePreference={updatePreference}
                />
              )}
              {activeSection === "notifications" && (
                <NotificationSettings
                  preferences={preferences}
                  updatePreference={updatePreference}
                  setNotificationGroup={setNotificationGroup}
                />
              )}
              <div className="mt-7 flex items-center justify-end gap-3 border-t border-[#d5e7d7] pt-5">
                {saved && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#3f7d55]">
                    <CheckCircle2 className="h-4 w-4" /> Saved
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-[#3f7d55] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#326844]"
                >
                  {saved ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}{" "}
                  Save changes
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
