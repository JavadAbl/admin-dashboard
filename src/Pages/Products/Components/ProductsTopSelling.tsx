import React from "react";
import { useNavigate } from "react-router";
import { useGetProducts } from "../../../Features/Product/ProductApi";
import LoadingSpinner from "../../../Components/Utils/LoadingSpinner";
import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";

export default function ProductsTopSelling() {
  const navigate = useNavigate();

  const { data: products, isLoading: isLoadingProducts } = useGetProducts();

  if (isLoadingProducts) return <LoadingSpinner />;
  if (!products) return null;

  const topSelling = [...products].sort((a, b) => b.sold - a.sold).slice(0, 3);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-base">پرفروش‌ترین کالاها</h2>
          <span className="badge badge-ghost badge-sm">این ماه</span>
        </div>
        <div className="space-y-3">
          {topSelling.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-base-50 border border-base-100 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => navigate(`/Products/${product.id}`)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-base-200 flex items-center justify-center text-2xl">
                  {product.image}
                </div>
                <div
                  className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                    index === 0
                      ? "bg-warning"
                      : index === 1
                        ? "bg-gray-400"
                        : "bg-amber-700"
                  }`}
                >
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{product.name}</p>
                <p className="text-xs text-base-content/50">
                  {product.brand} · {product.category}
                </p>
              </div>
              <div className="text-left flex-shrink-0">
                <p className="font-bold text-sm text-primary">
                  {formatNumber(product.sold)} فروش
                </p>
                <p className="text-xs text-base-content/50">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
