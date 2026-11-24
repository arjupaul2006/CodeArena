import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Briefcase,
  Image as ImageIcon,
  FileText,
  Check,
} from "lucide-react";

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    role: user?.role || "",
    email: user?.email || "",
    fullName: user?.fullName || "",
    profileImage: user?.profileImage || "",
    bio: user?.bio || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    gender: user?.gender || "",
    xLink: user?.xLink || "",
    birthday: user?.birthday
      ? new Date(user.birthday).toISOString().slice(0, 10)
      : "",
    location: user?.location || "",
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Update formData when user prop changes
  useEffect(() => {
    setFormData({
      username: user?.username || "",
      role: user?.role || "",
      email: user?.email || "",
      fullName: user?.fullName || "",
      profileImage: user?.profileImage || "",
      bio: user?.bio || "",
      linkedin: user?.linkedin || "",
      github: user?.github || "",
      gender: user?.gender || "",
      xLink: user?.xLink || "",
      birthday: user?.birthday
        ? new Date(user.birthday).toISOString().slice(0, 10)
        : "",
      location: user?.location || "",
    });
    setUsernameError("");
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "username") {
      setUsernameError(
        /\s/.test(value) ? "Username cannot contain spaces." : "",
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (/\s/.test(formData.username)) {
      setUsernameError("Username cannot contain spaces.");
      return;
    }
    setUsernameError("");
    if (onSave) {
      onSave(formData);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] p-6 shadow-2xl shadow-black/30 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-[#547060] dark:text-[#aabdaf] transition-colors hover:bg-[#dcecdf] dark:hover:bg-[#24382b] dark:bg-[#24382b] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#183226] dark:text-[#edf4ef]">
            Edit Profile
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#547060] dark:text-[#aabdaf]">
            Update your public persona, handles, and role details.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
              UserName
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-[#668170] dark:text-[#aabdaf]" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                aria-invalid={Boolean(usernameError)}
                aria-describedby={usernameError ? "username-error" : undefined}
                className={`w-full rounded-xl border bg-[#e8f3e8] dark:bg-[#111813] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:outline-none focus:ring-1 ${usernameError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500" : "border-[#b7d2bb] dark:border-[#405747] focus:border-[#3f7d55] focus:ring-[#3f7d55]"}`}
                placeholder="Your username"
              />
            </div>
            {usernameError && (
              <p
                id="username-error"
                role="alert"
                className="mt-1.5 text-xs font-semibold text-rose-700"
              >
                {usernameError}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 h-4 w-4 text-[#668170] dark:text-[#aabdaf]" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="Your full name"
              />
            </div>
          </div>

          {/* Role / Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
              Title / Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-[#668170] dark:text-[#aabdaf]" />
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="e.g. Senior Backend Engineer"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#668170] dark:text-[#aabdaf]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="alex.devnull@codearena.dev"
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
              Avatar Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3 h-4 w-4 text-[#668170] dark:text-[#aabdaf]" />
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
                Birthday
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 px-3 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 px-3 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 px-3 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 px-3 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
                GitHub
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 px-3 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5">
                X
              </label>
              <input
                type="url"
                name="xLink"
                value={formData.xLink}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 px-3 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="https://x.com/username"
              />
            </div>
          </div>
          {/* About Me */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] dark:text-[#aabdaf] mb-1.5 w-full">
              About Me
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full resize-none rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] py-2.5 px-3 text-sm font-semibold text-[#183226] dark:text-[#edf4ef] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
              placeholder="Tell the CodeArena community about yourself"
            />
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#b7d2bb] dark:border-[#405747]/60">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] px-4 py-2.5 text-xs font-bold text-[#547060] dark:text-[#aabdaf] transition-colors hover:bg-[#dcecdf] dark:hover:bg-[#24382b] dark:bg-[#24382b] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savedSuccess}
              className="inline-flex items-center gap-2 rounded-xl bg-[#3f7d55] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#8eae94]/40 transition-all hover:bg-[#326844] cursor-pointer disabled:opacity-80"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
