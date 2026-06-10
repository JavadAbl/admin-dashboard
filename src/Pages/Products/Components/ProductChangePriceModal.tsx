import { useCallback, useState } from "react";
import { DollarSign } from "lucide-react";
import type { Product } from "../../../Features/Product/CustomerTypes/ProductType";
import Modal from "../../../Components/Modals/Modal";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ProductChangePriceModal({
  isOpen,
  onClose,
  product,
}: Props) {
  const [price, setPrice] = useState(product.price);
  const [costPrice, setCostPrice] = useState(product.costPrice);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const margin =
    price > 0 ? Math.round(((price - costPrice) / price) * 100) : 0;

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setError("");

      if (price <= 0 || costPrice < 0) {
        setError("قیمت باید بزرگتر از صفر باشد");
        return;
      }

      if (costPrice > price) {
        setError("قیمت فروش نمی‌تواند کمتر از قیمت خریداری باشد");
        return;
      }

      setIsLoading(true);
      try {
        console.log(price, costPrice);
        toast.success("عملیات موفقیت آمیز");
        onClose();
        setPrice(product.price);
        setCostPrice(product.costPrice);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای نامشخص");
      } finally {
        setIsLoading(false);
      }
    },
    [price, costPrice, onClose, product],
  );

  return (
    <Modal
      title="تغییر قیمت"
      description={product.name}
      isOpen={isOpen}
      onClose={onClose}
      icon={DollarSign}
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
            <span className="label-text font-medium">قیمت فروش</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="input input-bordered input-sm w-full"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">قیمت خریداری</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
            className="input input-bordered input-sm w-full"
            disabled={isLoading}
          />
        </div>

        <div className="bg-base-200/50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/70">حاشیه سود:</span>
            <span
              className={`text-sm font-bold ${
                margin >= 25
                  ? "text-success"
                  : margin >= 15
                    ? "text-warning"
                    : "text-error"
              }`}
            >
              {margin}٪
            </span>
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
            ذخیره
          </button>
        </div>
      </form>
    </Modal>
  );
}
