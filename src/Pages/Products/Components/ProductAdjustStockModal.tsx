import { useCallback, useState } from "react";
import { Package } from "lucide-react";
import type { Product } from "../../../Features/Product/CustomerTypes/ProductType";
import Modal from "../../../Components/Modals/Modal";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ProductAdjustStockModal({
  isOpen,
  onClose,
  product,
}: Props) {
  const [stock, setStock] = useState(product.stock);
  const [minStock, setMinStock] = useState(product.minStock);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setError("");

      if (stock < 0 || minStock < 0) {
        setError("موجودی نمی‌تواند منفی باشد");
        return;
      }

      setIsLoading(true);
      try {
        console.log(stock, minStock);
        toast.success("عملیات موفقیت آمیز");
        onClose();
        setStock(product.stock);
        setMinStock(product.minStock);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای نامشخص");
      } finally {
        setIsLoading(false);
      }
    },
    [stock, minStock, onClose, product],
  );

  return (
    <Modal
      title="تنظیم موجودی"
      description={product.name}
      isOpen={isOpen}
      onClose={onClose}
      icon={Package}
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

        <div>
          <label className="label">
            <span className="label-text font-medium">موجودی کنونی</span>
          </label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="input input-bordered input-sm w-full"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">حداقل موجودی</span>
          </label>
          <input
            type="number"
            min="0"
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
            className="input input-bordered input-sm w-full"
            disabled={isLoading}
          />
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
            ذخیره
          </button>
        </div>
      </form>
    </Modal>
  );
}
