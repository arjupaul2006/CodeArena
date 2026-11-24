import { Monitor, Moon, Sun } from "lucide-react";
import { SelectControl, SettingRow, Toggle } from "./SettingsControls";
import { useTheme } from "../../context/ThemeContext";

export default function AppearanceSettings({ appearanceData, setAppearanceData }) {

  const { theme, setTheme, setAccent } = useTheme();

  const updateAppearance = (key, value) => {
    if (key === "theme"){
      setTheme(value === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : value);
    }
    if (key === "accentColor") {
      setAccent(value);
    }
    setAppearanceData((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="divide-y divide-[#d5e7d7] dark:divide-[#405747]">
      <SettingRow
        label="Application Theme"
        description="Choose how CodeArena looks"
      >
        <div className="flex gap-2">
          {[
            ["Dark", Moon, 'dark'],
            ["Light", Sun, 'light'],
            ["System", Monitor, 'system'],
          ].map(([value, Icon, themeValue]) => (
            <button
              type="button"
              key={value}
              onClick={() => updateAppearance("theme", themeValue)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${theme === themeValue ? "border-[#3f7d55] bg-[#dcecdf] dark:bg-[#24382b] text-[#2f6b45] dark:text-[#86c79a]" : "border-[#b7d2bb] dark:border-[#405747] text-[#668170] dark:text-[#aabdaf]"}`}
            >
              <Icon className="h-3.5 w-3.5" /> {value}
            </button>
          ))}
        </div>
      </SettingRow>
      <SettingRow
        label="Accent Color"
        description="Keep the green CodeArena identity or choose another accent"
      >
        <div className="flex gap-2">
          {["Green", "Blue", "Purple", "Orange"].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => updateAppearance("accentColor", value)}
              className={`h-7 w-7 rounded-full border-2 ${value === "Green" ? "bg-[#16a34a]" : value === "Blue" ? "bg-blue-500" : value === "Purple" ? "bg-purple-500" : "bg-orange-500"} ${appearanceData.accentColor === value ? "border-[#183226] ring-2 ring-[#c5dfc9] dark:border-white" : "border-transparent"}`}
              aria-label={`${value} accent`}
            />
          ))}
        </div>
      </SettingRow>
      <SettingRow label="Sidebar" description="Set the default sidebar state">
        <SelectControl
          value={appearanceData.sideCollapsed}
          onChange={(value) => updateAppearance("sideCollapsed", value)}
          ariaLabel="Sidebar state"
        >
          <option>Expanded</option>
          <option>Collapsed</option>
        </SelectControl>
      </SettingRow>
      <SettingRow
        label="UI Density"
        description="Control spacing throughout the interface"
      >
        <SelectControl
          value={appearanceData.density}
          onChange={(value) => updateAppearance("density", value)}
          ariaLabel="UI density"
        >
          <option>Comfortable</option>
          <option>Compact</option>
        </SelectControl>
      </SettingRow>
      <SettingRow
        label="Animations"
        description="Use motion effects across the interface"
      >
        <Toggle
          checked={appearanceData.animations}
          onChange={(value) => updateAppearance("animations", value)}
          label="Animations"
        />
      </SettingRow>
    </div>
  );
}
