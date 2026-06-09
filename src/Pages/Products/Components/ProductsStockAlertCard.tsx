import type { Product } from "../../../Features/Product/CustomerTypes/ProductType";
import { formatNumber } from "../../../Utils/AppUtils";
import { cn } from "../../../Utils/Cn";

interface StockAlertCardProps {
  products: Product[];
}

export default function ProductsStockAlertCard({
  products,
}: StockAlertCardProps) {
  const lowStock = products
    .filter((p) => p.stock <= p.minStock && p.status !== "draft")
    .sort((a, b) => a.stock - b.stock);

  if (lowStock.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
            هشدار موجودی
          </h2>
          <span className="badge badge-error badge-sm">
            {formatNumber(lowStock.length)} کالا
          </span>
        </div>
        <div className="space-y-3">
          {lowStock.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 rounded-lg bg-error/5 border border-error/10 hover:bg-error/10 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">{product.image}</span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-base-content/50">{product.sku}</p>
                </div>
              </div>
              <div className="text-left flex-shrink-0 mr-3">
                <span
                  className={cn(
                    "badge badge-sm",
                    product.stock === 0 ? "badge-error" : "badge-warning",
                  )}
                >
                  {product.stock === 0
                    ? "ناموجود"
                    : `${formatNumber(product.stock)} عدد`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
