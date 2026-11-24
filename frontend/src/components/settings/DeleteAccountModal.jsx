import { useEffect, useState, useContext } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../../context/UserContext";

export default function DeleteAccountModal({ isOpen, onClose }) {
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  // Reset modal state when it opens
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError("");
      setIsPasswordVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const closeModal = () => {
    if (!isDeleting) onClose();
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    if (!password) {
      setError("Enter your current password.");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      await axios.delete(`${backendUrl}/api/delete-account`, {
        data: { password },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.removeItem("token");
      setUser({ name: "", email: "" });
      onClose();
      navigate("/login");
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.message ||
          "Unable to delete your account. Try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        className="w-full max-w-md rounded-2xl border border-rose-200 bg-[#f4faf1] dark:bg-[#172019] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="delete-account-title"
              className="text-lg font-bold text-[#183226] dark:text-[#edf4ef]"
            >
              Delete Account
            </h2>
            <p className="mt-1 text-xs text-[#668170] dark:text-[#aabdaf]">
              Enter your current password to permanently delete your account.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            disabled={isDeleting}
            aria-label="Close delete account"
            className="rounded-full p-1.5 text-[#547060] dark:text-[#aabdaf] hover:bg-[#dcecdf] dark:hover:bg-[#24382b] dark:bg-[#24382b] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleDelete} className="mt-5 space-y-4">
          <label className="block space-y-1.5 text-sm font-semibold text-[#385a43] dark:text-[#aabdaf]">
            Current Password
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                required
                autoComplete="current-password"
                autoFocus
                className="w-full rounded-lg border border-rose-200 bg-[#f4faf1] dark:bg-[#172019] px-3 py-2.5 pr-10 font-normal outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((current) => !current)}
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#668170] dark:text-[#aabdaf] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef]"
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-[#d5e7d7] dark:border-[#405747] pt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={isDeleting}
              className="rounded-lg border border-[#b7d2bb] dark:border-[#405747] px-4 py-2 text-sm font-semibold text-[#385a43] dark:text-[#aabdaf] hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDeleting}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
