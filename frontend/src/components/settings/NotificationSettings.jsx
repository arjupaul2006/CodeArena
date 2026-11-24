import { SettingRow, Toggle } from "./SettingsControls";

const groups = [
  ["Contest Notifications", [["contestReminders", "Upcoming contest reminders"], ["contestStartingSoon", "Contest starting soon"], ["contestResults", "Contest result announcements"], ["leaderboardUpdates", "Contest leaderboard updates"]]],
  ["Platform Notifications", [["problemsAdded", "New problems added"], ["contestAnnouncements", "New contest announcements"], ["systemUpdates", "System updates"], ["importantAnnouncements", "Important announcements"]]],
  ["Email Notifications", [["weeklyProgress", "Weekly coding progress report"], ["securityAlerts", "Account security alerts"], ["productUpdates", "Product updates"]]],
];

export default function NotificationSettings({ preferences, updatePreference, setNotificationGroup }) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2"><button type="button" onClick={() => setNotificationGroup(true)} className="rounded-lg bg-[#3f7d55] px-3 py-2 text-xs font-semibold text-white hover:bg-[#326844]">Enable all</button><button type="button" onClick={() => setNotificationGroup(false)} className="rounded-lg border border-[#b7d2bb] dark:border-[#405747] px-3 py-2 text-xs font-semibold text-[#385a43] dark:text-[#aabdaf] hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]">Disable all</button></div>
      {groups.map(([group, items]) => <div key={group} className="mb-5 rounded-xl border border-[#d5e7d7] dark:border-[#405747] px-4"><h3 className="border-b border-[#d5e7d7] dark:border-[#405747] py-3 text-sm font-bold text-[#244333] dark:text-[#edf4ef]">{group}</h3>{items.map(([key, label]) => <SettingRow key={key} label={label}><Toggle checked={preferences[key]} onChange={(value) => updatePreference(key, value)} label={label} /></SettingRow>)}</div>)}
      <SettingRow label="Browser notification permission" description="Allow CodeArena to show alerts in your browser"><button type="button" className="rounded-lg border border-[#b7d2bb] dark:border-[#405747] px-3 py-2 text-xs font-semibold text-[#385a43] dark:text-[#aabdaf] hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]">Request permission</button></SettingRow>
    </div>
  );
}
