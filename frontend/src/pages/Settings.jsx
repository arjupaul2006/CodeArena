import { useContext, useEffect, useMemo, useRef, useState } from "react";
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

  const [activeSection, setActiveSection] = useState("account");

  const [profile, setProfile] = useState({
    username: user?.username || "",
    fullName: user?.fullName || user?.name || "",
    name: user?.fullName || user?.name || "",
    email: user?.email || "",
    profileImage: user?.profileImage || "",
    role: user?.role || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    gender: user?.gender || "",
    xLink: user?.xLink || "",
    birthday: user?.birthday ? new Date(user.birthday).toISOString().slice(0, 10) : "",
    location: user?.location || "",
    bio: user?.bio || "",
  });
  const [saved, setSaved] = useState(false);
  const currentSection = useMemo(
    () =>
      settingsSections.find((section) => section.id === activeSection) ||
      settingsSections[0],
    [activeSection],
  );

  // for editor preferences
  const [preferences, setPreferences] = useState(defaultPreferences);
  const { settings, setSettings } = useContext(SettingsDataContext);
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

  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // update profile state when user context changes
  useEffect(() => {
    if (!user) return;
    setProfile({
      username: user.username || "",
      fullName: user.fullName || user.name || "",
      name: user.fullName || user.name || "",
      email: user.email || "",
      profileImage: user.profileImage || "",
      role: user.role || "",
      linkedin: user.linkedin || "",
      github: user.github || "",
      gender: user.gender || "",
      xLink: user.xLink || "",
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().slice(0, 10)
        : "",
      location: user.location || "",
      bio: user.bio || "",
    });
  }, [user]);

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
    if (typeof profile.username === "string" && /\s/.test(profile.username)) {
      showToast("error", "Username cannot contain spaces.");
      return;
    }

    try {
      setPreferences((current) => ({ ...current, editor: editorData }));
      setSettings((current) => ({ ...current, editor: editorData }));
      setUser((current) => ({ ...current, ...profile }));

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const profileData = {
        username: profile.username,
        fullName: profile.fullName,
        email: profile.email,
        profileImage: profile.profileImage,
        linkedin: profile.linkedin,
        github: profile.github,
        gender: profile.gender,
        xLink: profile.xLink,
        birthday: profile.birthday,
        location: profile.location,
        bio: profile.bio,
      };
      await axios.post(
        `${backendUrl}/api/update-profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
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

  const showToast = (type, message) => {
    setToast({ type, message });
    clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3500);
  };

  // Clear the toast timeout when the component unmounts
  useEffect(() => {
    return () => clearTimeout(toastTimeoutRef.current);
  }, []);

  // Update profile image to backend and context
  const handleProfileImageChange = async (file, profileImageUrl) => {
    const previousImageUrl = user?.profileImage || "";
    const formData = new FormData();
    formData.append("profileImage", file);
    setProfile((prev) => ({ ...prev, profileImage: profileImageUrl }));
    setUser((prevUser) => ({ ...prevUser, profileImage: profileImageUrl }));

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const response = await axios.patch(
        `${backendUrl}/api/update-profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const savedImageUrl =
        response.data?.user?.profileImage || profileImageUrl;
      setProfile((prev) => ({ ...prev, profileImage: savedImageUrl }));
      setUser((prevUser) => ({ ...prevUser, profileImage: savedImageUrl }));
      showToast("success", "Profile image changed successfully.");
    } catch (error) {
      setProfile((prev) => ({ ...prev, profileImage: previousImageUrl }));
      setUser((prevUser) => ({ ...prevUser, profileImage: previousImageUrl }));
      console.error("Error updating profile image:", error);
      showToast("error", "Unable to change your profile image.");
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
                <AccountSettings
                  profile={profile}
                  setProfile={setProfile}
                  onProfileImageChange={handleProfileImageChange}
                />
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
