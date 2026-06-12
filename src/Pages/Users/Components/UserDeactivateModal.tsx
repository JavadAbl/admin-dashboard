import { useCallback, useState } from "react";
import { ToggleLeft } from "lucide-react";
import { toast } from "sonner";
import type { User } from "../../../Features/Auth/AuthTypes/UserType";
import Modal from "../../../Components/Modals/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function UserDeactivateModal({ isOpen, onClose, user }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setError("");

      if (!reason.trim()) {
        setError("لطفاً دلیل غیرفعال‌سازی را وارد کنید");
        return;
      }

      setIsLoading(true);
      try {
        console.log({
          userId: user.id,
          reason,
        });
        toast.success("کاربر با موفقیت غیرفعال شد");
        onClose();
        setReason("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای نامشخص");
      } finally {
        setIsLoading(false);
      }
    },
    [reason, onClose, user.id],
  );

  return (
    <Modal
      title="غیرفعال‌سازی کاربر"
      isOpen={isOpen}
      onClose={onClose}
      icon={ToggleLeft}
    >
      <div className="p-6 space-y-4">
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

        <div className="alert alert-warning">
          <svg
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4v2m0 4v2"
            />
          </svg>
          <div>
            <h3 className="font-bold">توجه!</h3>
            <div className="text-sm">
              این عملیات دسترسی کاربر را به سیستم قطع می‌کند. آیا مطمئن هستید؟
            </div>
          </div>
        </div>

        <div className="bg-base-200/50 rounded-lg p-3 border border-base-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-base-content/50 font-mono" dir="ltr">
                @{user.username}
              </p>
            </div>
            <span className="badge badge-success badge-sm gap-1">فعال</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">
                دلیل غیرفعال‌سازی <span className="text-error">*</span>
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered textarea-sm w-full h-20 resize-none"
              placeholder="دلیل غیرفعال‌سازی حساب کاربری را شرح دهید..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-2">
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
              className="btn btn-error btn-sm flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : null}
              غیرفعال‌سازی
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
