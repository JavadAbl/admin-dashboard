import { useCallback, useState } from "react";
import { Trash2 } from "lucide-react";
import Modal from "../../../Components/Modals/Modal";
import type { Product } from "../../../Features/Product/CustomerTypes/ProductType";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ProductDeleteModal({
  isOpen,
  onClose,
  product,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setError("");

      setIsLoading(true);
      try {
        console.log(product.id);
        toast.success("عملیات موفقیت آمیز");
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای نامشخص");
      } finally {
        setIsLoading(false);
      }
    },
    [onClose, product.id],
  );

  return (
    <Modal title="حذف محصول" isOpen={isOpen} onClose={onClose} icon={Trash2}>
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
              این عملیات قابل برگشت نیست. آیا مطمئن هستید؟
            </div>
          </div>
        </div>

        <div className="bg-base-200/50 rounded-lg p-3 border border-base-300">
          <p className="text-sm font-medium">{product.name}</p>
          <p className="text-xs text-base-content/50 font-mono">
            {product.sku}
          </p>
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
            onClick={handleSubmit}
            className="btn btn-error btn-sm flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : null}
            حذف محصول
          </button>
        </div>
      </div>
    </Modal>
  );
}
