import React, { useState } from "react";
import { X, User, Mail, Briefcase, Image as ImageIcon, FileText, Check } from "lucide-react";

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}) {
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    role: initialData?.role || "",
    email: initialData?.email || "",
    bio: initialData?.bio || "Passionate competitive programmer striving for grandmaster rating.",
    profileImage: initialData?.profileImage || "",
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <div className="relative w-full max-w-lg rounded-3xl border border-[#b7d2bb] bg-[#f4faf1] p-6 shadow-2xl shadow-black/30 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-[#547060] transition-colors hover:bg-[#dcecdf] hover:text-[#183226] cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#183226]">
            Edit Profile
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#547060]">
            Update your public persona, handles, and role details.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] mb-1.5">
              Display Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-[#668170]" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#183226] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="Your username"
              />
            </div>
          </div>

          {/* Role / Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] mb-1.5">
              Title / Role
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-[#668170]" />
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#183226] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="e.g. Senior Backend Engineer"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#668170]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#183226] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="alex.devnull@codearena.dev"
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] mb-1.5">
              Avatar Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3 h-4 w-4 text-[#668170]" />
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#183226] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#385a43] mb-1.5">
              Bio Summary
            </label>
            <div className="relative">
              <textarea
                name="bio"
                rows={2}
                value={formData.bio}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] p-3 text-sm font-medium text-[#183226] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
                placeholder="Short bio for your public profile..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#b7d2bb]/60">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] px-4 py-2.5 text-xs font-bold text-[#547060] transition-colors hover:bg-[#dcecdf] hover:text-[#183226] cursor-pointer"
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

