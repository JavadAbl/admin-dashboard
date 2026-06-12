import { useCallback, useState } from "react";
import { ToggleRight } from "lucide-react";
import { toast } from "sonner";
import type { User } from "../../../Features/Auth/AuthTypes/UserType";
import Modal from "../../../Components/Modals/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function UserActivateModal({ isOpen, onClose, user }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setError("");

      setIsLoading(true);
      try {
        console.log({
          userId: user.id,
          action: "activate",
        });
        toast.success("کاربر با موفقیت فعال شد");
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای نامشخص");
      } finally {
        setIsLoading(false);
      }
    },
    [onClose, user.id],
  );

  return (
    <Modal
      title="فعال‌سازی کاربر"
      description={`@${user.username}`}
      isOpen={isOpen}
      onClose={onClose}
      icon={ToggleRight}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="alert alert-error">
            <svg
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-base-200/50 rounded-lg p-3 border border-base-300">
          <p className="text-xs text-base-content/60 mb-1">کاربر</p>
          <p className="text-sm font-medium mb-2">{user.name}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60 font-mono" dir="ltr">
              @{user.username}
            </span>
            <span className="badge badge-ghost badge-sm gap-1">غیرفعال</span>
          </div>
        </div>

        <div className="alert alert-info">
          <svg
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">فعال‌سازی</h3>
            <div className="text-sm">
              با فعال‌سازی، کاربر دوباره امکان دسترسی به سیستم را خواهد داشت.
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            className="btn btn-ghost btn-sm flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            انصراف
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : null}
            فعال‌سازی
          </button>
        </div>
      </form>
    </Modal>
  );
}
