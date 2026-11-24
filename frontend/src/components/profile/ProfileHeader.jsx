import React, { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  ImagePlus,
  Mail,
  ShieldCheck,
  Share2,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useContext } from "react";
import UserContext from "../../context/UserContext";

export default function ProfileHeader({
  profile,
  user,
  canEditProfile,
  onEditClick,
  onShareClick,
  onProfileImageChange,
}) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [isEditOptionsOpen, setIsEditOptionsOpen] = useState(true);

  // Robust username resolver: ensures username is never empty or hidden
  const displayUsername =
    (user?.username && user.username.trim()) ||
    (profile?.username && profile.username.trim()) ||
    (user?.name && user.name.trim()) ||
    (user?.email && user.email.split("@")[0]) ||
    "Alex DevNull";

  const displayRole =
    (user?.role && user.role.trim()) ||
    (profile?.role && profile.role.trim()) ||
    "Senior Backend Engineer";

  const displayEmail =
    (user?.email && user.email.trim()) ||
    (profile?.email && profile.email.trim()) ||
    "alex.devnull@codearena.dev";

  const displayBio =
    (user?.bio && user.bio.trim()) ||
    (profile?.bio && profile.bio.trim()) ||
    "";

  const formattedCreatedAt = (date_time) => {
    if (!date_time) return "Joined Recently";

    const date = new Date(date_time);
    if (Number.isNaN(date.getTime())) return "Joined Recently";

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleShare = () => {
    if (onShareClick) {
      onShareClick();
      return;
    }
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle profile image upload and validation
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageUploadError("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError("Please choose an image smaller than 5 MB.");
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
      onProfileImageChange?.(file, reader.result);
    };
    reader.onerror = () => {
      setImageUploadError("The selected image could not be read.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="relative rounded-3xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] shadow-xl shadow-[#8eae94]/20 transition-all">
      {/* Dynamic Cover Banner with decorative gaming grid glow */}
      <div className="relative h-32 sm:h-44 rounded-t-3xl bg-gradient-to-r from-[#1b3d2b] via-[#2f6645] to-[#47875e] overflow-hidden z-0">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#b7d2bb_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#76a980]/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 h-48 w-48 rounded-full bg-[#3f7d55]/30 blur-2xl pointer-events-none" />

        {/* Tier / Division Ribbon */}
        <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
          <Trophy className="h-3.5 w-3.5 text-amber-300" />
          <span>Knight Division</span>
          <span className="hidden sm:inline-block text-[#a6cbaa] dark:text-[#b9d7bf]">|</span>
          <span className="hidden sm:inline-block font-mono text-emerald-200">
            Tier III
          </span>
        </div>
      </div>

      {/* Profile Details Container - relative z-10 ensures it sits cleanly in front */}
      <div className="relative z-10 px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="-mt-14 sm:-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar and Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative shrink-0 group">
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
              <label
                htmlFor="profile-image-upload"
                className="block h-28 w-28 sm:h-36 sm:w-36 cursor-pointer rounded-2xl sm:rounded-3xl border-4 border-[#f4faf1] bg-[#dcecdf] dark:bg-[#24382b] shadow-xl overflow-hidden ring-2 ring-[#a6cbaa]/50 focus-within:ring-4 focus-within:ring-[#3f7d55]/50"
                title="Change profile image"
              >
                {user?.profileImage && !imageError ? (
                  <img
                    src={user.profileImage}
                    alt={`${displayUsername} avatar`}
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3f7d55] to-[#244b34] text-4xl sm:text-5xl font-black uppercase text-white shadow-inner select-none">
                    {displayUsername.charAt(0).toUpperCase()}
                  </div>
                )}
              </label>
              <div className="pointer-events-none absolute inset-1 flex items-center justify-center rounded-xl sm:rounded-2xl bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <ImagePlus className="h-7 w-7" aria-hidden="true" />
                <span className="sr-only">Choose a new profile image</span>
              </div>
              {/* Online / Active Badge Indicator */}
              <div className="absolute bottom-1 right-1 rounded-full bg-[#f4faf1] dark:bg-[#172019] p-1 shadow-md">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
              </div>
              {imageUploadError && (
                <p className="absolute left-1/2 top-full mt-2 w-48 -translate-x-1/2 text-center text-[11px] font-semibold text-red-600">
                  {imageUploadError}
                </p>
              )}
            </div>

            {/* Username & Title Details */}
            <div className="pt-1 sm:pt-0 sm:pb-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#183226] dark:text-[#edf4ef] block">
                  {displayUsername}
                </h1>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center sm:justify-end gap-2.5 self-stretch sm:self-auto sm:mb-1">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813] px-4 py-2.5 text-xs font-bold text-[#385a43] dark:text-[#aabdaf] transition-all hover:bg-[#dcecdf] dark:hover:bg-[#24382b] dark:bg-[#24382b] hover:border-[#3f7d55] cursor-pointer shadow-xs"
              title="Copy Profile Link"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copied ? "Copied Link!" : "Share"}</span>
            </button>
            {canEditProfile && (
              <button
                type="button"
                onClick={onEditClick}
                className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-[#3f7d55] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#8eae94]/40 transition-all hover:bg-[#326844] hover:shadow-lg hover:shadow-[#8eae94]/50 cursor-pointer active:scale-98"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {displayBio && (
          <div className="mt-6 rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813]/70 p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#668170] dark:text-[#aabdaf]">
              About Me
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#244333] dark:text-[#edf4ef]">
              {displayBio}
            </p>
          </div>
        )}

        {/* Quick Meta Pills Grid */}
        <div className="mt-7 grid grid-cols-1 gap-3 border-t border-[#b7d2bb] dark:border-[#405747] pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813]/70 p-3.5 transition-colors hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dcecdf] dark:bg-[#24382b] text-[#3f7d55] dark:text-[#86c79a]">
              <Mail className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#668170] dark:text-[#aabdaf]">
                Email
              </p>
              <p
                className="truncate text-xs font-semibold text-[#183226] dark:text-[#edf4ef]"
                title={displayEmail}
              >
                {displayEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813]/70 p-3.5 transition-colors hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dcecdf] dark:bg-[#24382b] text-[#3f7d55] dark:text-[#86c79a]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#668170] dark:text-[#aabdaf]">
                Rank Standing
              </p>
              <p className="truncate text-xs font-semibold text-[#183226] dark:text-[#edf4ef]">
                {displayRole || "Grandmaster Track"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813]/70 p-3.5 transition-colors hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dcecdf] dark:bg-[#24382b] text-[#3f7d55] dark:text-[#86c79a]">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#668170] dark:text-[#aabdaf]">
                Member Since
              </p>
              <p className="truncate text-xs font-semibold text-[#183226] dark:text-[#edf4ef]">
                {formattedCreatedAt(user?.createdAt || profile?.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813]/70 p-3.5 transition-colors hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#dcecdf] dark:bg-[#24382b] text-[#3f7d55] dark:text-[#86c79a]">
              <Clock3 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#668170] dark:text-[#aabdaf]">
                Last Active
              </p>
              <p className="truncate text-xs font-semibold text-[#183226] dark:text-[#edf4ef]">
                {formattedCreatedAt(user?.updatedAt || profile?.lastActive) ||
                  "Recently Active"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
