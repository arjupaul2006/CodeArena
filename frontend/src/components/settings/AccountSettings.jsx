import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

export default function AccountSettings({
  profile,
  setProfile,
  onProfileImageChange,
}) {
  const [imageError, setImageError] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [profile.profileImage]);

  // Handle profile image upload and validation
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageUploadError("Please choose an image file.");
      setImageError(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError("Please choose an image smaller than 5 MB.");
      setImageError(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setImageUploadError("The selected image could not be read.");
        return;
      }

      setImageError(false);
      setImageUploadError("");
      setProfile((current) => ({
        ...current,
        profileImage: reader.result,
      }));
      onProfileImageChange?.(file, reader.result);
    };
    reader.onerror = () => {
      setImageError(false);
      setImageUploadError("The selected image could not be read.");
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsernameError(
        /\s/.test(value) ? "Username cannot contain spaces." : "",
      );
    }
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-5 rounded-xl border border-[#d5e7d7] bg-[#e8f3e8] p-5 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0">
          {profile.profileImage && !imageError ? (
            <img
              src={profile.profileImage}
              alt="Profile preview"
              onError={() => {
                setImageError(true);
                setImageUploadError("The profile image could not be loaded.");
              }}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-[#c5dfc9]"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#3f7d55] text-2xl font-bold uppercase text-white ring-4 ring-[#c5dfc9]">
              {(profile.username || profile.name || "U").charAt(0)}
            </div>
          )}
          <label
            htmlFor="settings-profile-image"
            className="absolute -bottom-1 -right-1 cursor-pointer rounded-full border border-[#a6cbaa] bg-white p-2 text-[#3f7d55] shadow-sm"
            title="Change profile picture"
          >
            <ImagePlus className="h-4 w-4" />
            <span className="sr-only">Change profile picture</span>
          </label>
          <input
            id="settings-profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <div>
          <p className="font-semibold text-[#244333]">Profile Picture</p>
          <p className="mt-1 text-xs text-[#668170]">
            Upload a JPG, PNG, or GIF up to 5 MB.
          </p>
          {imageUploadError && (
            <p
              role="alert"
              className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
            >
              {imageUploadError}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["username", "Username"],
          ["fullName", "Full Name"],
          ["email", "Email Address"],
        ].map(([key, label]) => (
          <label
            key={key}
            className="space-y-1.5 text-sm font-semibold text-[#385a43]"
          >
            {label}
            <input
              type={key === "email" ? "email" : "text"}
              value={profile[key]}
              name={key}
              onChange={handleChange}
              aria-invalid={key === "username" && Boolean(usernameError)}
              className={`w-full rounded-lg border bg-[#f4faf1] px-3 py-2.5 font-normal outline-none focus:ring-1 ${key === "username" && usernameError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500" : "border-[#b7d2bb] focus:border-[#3f7d55] focus:ring-[#3f7d55]"}`}
            />
          </label>
        ))}
        {usernameError && (
          <p role="alert" className="text-xs font-semibold text-rose-700 sm:col-span-2">
            {usernameError}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-semibold text-[#385a43]">
          Birthday
          <input
            type="date"
            name="birthday"
            value={profile.birthday || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#b7d2bb] bg-[#f4faf1] px-3 py-2.5 font-normal outline-none focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55]"
          />
        </label>

        <label className="space-y-1.5 text-sm font-semibold text-[#385a43]">
          Location
          <input
            type="text"
            name="location"
            value={profile.location || ""}
            onChange={handleChange}
            placeholder="City, Country"
            className="w-full rounded-lg border border-[#b7d2bb] bg-[#f4faf1] px-3 py-2.5 font-normal outline-none focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55]"
          />
        </label>

        <label className="space-y-1.5 text-sm font-semibold text-[#385a43]">
          Gender
          <select
            name="gender"
            value={profile.gender || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-[#b7d2bb] bg-[#f4faf1] px-3 py-2.5 font-normal outline-none focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55]"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </label>

        {[
          ["linkedin", "LinkedIn", "https://linkedin.com/in/username"],
          ["github", "GitHub", "https://github.com/username"],
          ["xLink", "X", "https://x.com/username"],
        ].map(([key, label, placeholder]) => (
          <label
            key={key}
            className="space-y-1.5 text-sm font-semibold text-[#385a43]"
          >
            {label}
            <input
              type="url"
              name={key}
              value={profile[key] || ""}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full rounded-lg border border-[#b7d2bb] bg-[#f4faf1] px-3 py-2.5 font-normal outline-none focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55]"
            />
          </label>
        ))}
      </div>

      <label className="block space-y-1.5 text-sm font-semibold text-[#385a43]">
        About Me
        <textarea
          name="bio"
          value={profile.bio || ""}
          onChange={handleChange}
          rows={4}
          placeholder="Tell the CodeArena community about yourself"
          className="w-full resize-none rounded-lg border border-[#b7d2bb] bg-[#f4faf1] px-3 py-2.5 font-normal outline-none focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55]"
        />
      </label>
      <div className="flex flex-wrap gap-3 border-t border-[#d5e7d7] pt-5">
        <button
          type="button"
          onClick={openPasswordModal}
          className="rounded-lg border border-[#b7d2bb] px-4 py-2 text-sm font-semibold text-[#385a43] hover:bg-[#e8f3e8]"
        >
          Change Password
        </button>
        <button
          type="button"
          className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
        >
          Delete Account
        </button>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
