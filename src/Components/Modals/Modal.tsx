import {
  useCallback,
  useEffect,
  useRef,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react";
import { cn } from "../../Utils/Cn";

interface Props {
  title: string;
  description?: string;
  fileDialogOpen?: boolean;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export default function Modal({
  title,
  description,
  isOpen,
  onClose,
  fileDialogOpen = false,
  children,
  className,
  icon: Icon,
}: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    if (isOpen && !modal.open) {
      modal.showModal();
    } else if (!isOpen && modal.open) {
      modal.close();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const handleCancel = (e: Event) => {
      if (fileDialogOpen) {
        e.preventDefault(); // block Esc and backdrop‑triggered close
        return;
      }
      handleClose();
    };
    modal.addEventListener("cancel", handleCancel);
    return () => modal.removeEventListener("cancel", handleCancel);
  }, [fileDialogOpen, handleClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === modalRef.current) handleClose();
  };

  return (
    <>
      <dialog
        ref={modalRef}
        className="modal modal-bottom sm:modal-middle"
        onClick={handleBackdropClick}
      >
        <div className={cn("modal-box flex flex-col p-0", className)}>
          {/* Header */}
          <div className="flex items-center justify-between mx-6 py-4 border-b border-base-300  shrink-0 p-[6_4]">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                  <Icon />
                </div>
              )}
              <div>
                <h3 className="font-bold text-base truncate">{title}</h3>
                {description && (
                  <p className="text-xs text-base-content/50">{description}</p>
                )}
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={handleClose}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-auto"> {children}</div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    </>
  );
}
