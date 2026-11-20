import { Monitor, Moon, Sun } from "lucide-react";
import { SelectControl, SettingRow, Toggle } from "./SettingsControls";

export default function AppearanceSettings({ preferences, updatePreference }) {
  return (
    <div className="divide-y divide-[#d5e7d7]">
      <SettingRow label="Application Theme" description="Choose how CodeArena looks"><div className="flex gap-2">{[["Dark", Moon], ["Light", Sun], ["System", Monitor]].map(([value, Icon]) => <button type="button" key={value} onClick={() => updatePreference("applicationTheme", value)} className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${preferences.applicationTheme === value ? "border-[#3f7d55] bg-[#dcecdf] text-[#2f6b45]" : "border-[#b7d2bb] text-[#668170]"}`}><Icon className="h-3.5 w-3.5" /> {value}</button>)}</div></SettingRow>
      <SettingRow label="Accent Color" description="Keep the green CodeArena identity or choose another accent"><div className="flex gap-2">{["Green", "Blue", "Purple"].map((value) => <button type="button" key={value} onClick={() => updatePreference("accentColor", value)} className={`h-7 w-7 rounded-full border-2 ${value === "Green" ? "bg-[#3f7d55]" : value === "Blue" ? "bg-blue-500" : "bg-purple-500"} ${preferences.accentColor === value ? "border-[#183226] ring-2 ring-[#c5dfc9]" : "border-transparent"}`} aria-label={`${value} accent`} />)}</div></SettingRow>
      <SettingRow label="Sidebar" description="Set the default sidebar state"><SelectControl value={preferences.sidebar} onChange={(value) => updatePreference("sidebar", value)} ariaLabel="Sidebar state"><option>Expanded</option><option>Collapsed</option></SelectControl></SettingRow>
      <SettingRow label="UI Density" description="Control spacing throughout the interface"><SelectControl value={preferences.density} onChange={(value) => updatePreference("density", value)} ariaLabel="UI density"><option>Comfortable</option><option>Compact</option></SelectControl></SettingRow>
      <SettingRow label="Animations" description="Use motion effects across the interface"><Toggle checked={preferences.animations} onChange={(value) => updatePreference("animations", value)} label="Animations" /></SettingRow>
    </div>
  );
}
