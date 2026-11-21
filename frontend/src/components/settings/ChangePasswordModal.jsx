import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import axios from "axios";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [visiblePasswordFields, setVisiblePasswordFields] = useState({});

  // Reset form and errors when modal opens
  useEffect(() => {
    if (isOpen) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError("");
      setPasswordSuccess("");
      setVisiblePasswordFields({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const closeModal = () => {
    if (!isUpdatingPassword) onClose();
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      await axios.patch(
        `${backendUrl}/api/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setPasswordSuccess("Password updated successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(
        error.response?.data?.message ||
          "Unable to update your password. Try again.",
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        className="w-full max-w-md rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="change-password-title" className="text-lg font-bold text-[#183226]">
              Change Password
            </h2>
            <p className="mt-1 text-xs text-[#668170]">
              Enter your current password and choose a new one.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            disabled={isUpdatingPassword}
            aria-label="Close change password"
            className="rounded-full p-1.5 text-[#547060] hover:bg-[#dcecdf] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handlePasswordUpdate} className="mt-5 space-y-4">
          {[
            ["currentPassword", "Current Password"],
            ["newPassword", "New Password"],
            ["confirmPassword", "Confirm New Password"],
          ].map(([name, label]) => (
            <label key={name} className="block space-y-1.5 text-sm font-semibold text-[#385a43]">
              {label}
              <div className="relative">
                <input
                  type={visiblePasswordFields[name] ? "text" : "password"}
                  name={name}
                  value={passwordForm[name]}
                  onChange={handlePasswordChange}
                  required
                  autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
                  className="w-full rounded-lg border border-[#b7d2bb] bg-[#f4faf1] px-3 py-2.5 pr-10 font-normal outline-none focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setVisiblePasswordFields((current) => ({
                      ...current,
                      [name]: !current[name],
                    }))
                  }
                  aria-label={`${visiblePasswordFields[name] ? "Hide" : "Show"} ${label.toLowerCase()}`}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#668170] hover:text-[#183226]"
                >
                  {visiblePasswordFields[name] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>
          ))}

          {passwordError && (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {passwordError}
            </p>
          )}
          {passwordSuccess && (
            <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              {passwordSuccess}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-[#d5e7d7] pt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={isUpdatingPassword}
              className="rounded-lg border border-[#b7d2bb] px-4 py-2 text-sm font-semibold text-[#385a43] hover:bg-[#e8f3e8] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="rounded-lg bg-[#3f7d55] px-4 py-2 text-sm font-bold text-white hover:bg-[#326844] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
