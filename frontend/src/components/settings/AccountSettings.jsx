import { ImagePlus } from "lucide-react";

export default function AccountSettings({ profile, setProfile }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-5 rounded-xl border border-[#d5e7d7] bg-[#e8f3e8] p-5 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0">
          {profile.profileImage ? <img src={profile.profileImage} alt="Profile preview" className="h-20 w-20 rounded-full object-cover ring-4 ring-[#c5dfc9]" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#3f7d55] text-2xl font-bold uppercase text-white ring-4 ring-[#c5dfc9]">{(profile.username || profile.name || "U").charAt(0)}</div>}
          <label htmlFor="settings-profile-image" className="absolute -bottom-1 -right-1 cursor-pointer rounded-full border border-[#a6cbaa] bg-white p-2 text-[#3f7d55] shadow-sm" title="Change profile picture">
            <ImagePlus className="h-4 w-4" /><span className="sr-only">Change profile picture</span>
          </label>
          <input id="settings-profile-image" type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) setProfile((current) => ({ ...current, profileImage: URL.createObjectURL(file) })); }} />
        </div>
        <div><p className="font-semibold text-[#244333]">Profile Picture</p><p className="mt-1 text-xs text-[#668170]">Upload a JPG, PNG, or GIF up to 5 MB.</p></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[["username", "Username"], ["name", "Full Name"], ["email", "Email Address"]].map(([key, label]) => (
          <label key={key} className="space-y-1.5 text-sm font-semibold text-[#385a43]">{label}
            <input type={key === "email" ? "email" : "text"} value={profile[key]} onChange={(event) => setProfile((current) => ({ ...current, [key]: event.target.value }))} className="w-full rounded-lg border border-[#b7d2bb] bg-[#f4faf1] px-3 py-2.5 font-normal outline-none focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55]" />
          </label>
        ))}
        <label className="space-y-1.5 text-sm font-semibold text-[#385a43] sm:col-span-2">Bio
          <textarea value={profile.bio} onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))} rows={3} placeholder="Tell the CodeArena community about yourself" className="w-full resize-none rounded-lg border border-[#b7d2bb] bg-[#f4faf1] px-3 py-2.5 font-normal outline-none focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55]" />
        </label>
      </div>
      <div className="flex flex-wrap gap-3 border-t border-[#d5e7d7] pt-5">
        <button type="button" className="rounded-lg border border-[#b7d2bb] px-4 py-2 text-sm font-semibold text-[#385a43] hover:bg-[#e8f3e8]">Change Password</button>
        <button type="button" className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">Delete Account</button>
      </div>
    </div>
  );
}
