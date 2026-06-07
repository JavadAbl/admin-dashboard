import { toPersianNum } from "../../../Utils/AppUtils";
import { cn } from "../../../Utils/Cn";
import { useGetTopProducts } from "../../../Features/App/AppApi";
import LoadingSpinner from "../../../Components/Utils/LoadingSpinner";

export default function DashboardTopProducts() {
  const { data: topProducts, isLoading } = useGetTopProducts();

  if (isLoading) return <LoadingSpinner />;
  if (!topProducts) return null;
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-base-content">
              محصولات پرفروش
            </h2>
            <p className="text-sm text-base-content/60">
              پرفروش‌ترین‌های این ماه
            </p>
          </div>
          <button className="btn btn-ghost btn-sm">مشاهده همه</button>
        </div>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-base-200/50"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                  index === 0
                    ? "bg-amber-100 text-amber-700"
                    : index === 1
                      ? "bg-gray-100 text-gray-600"
                      : index === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-base-200 text-base-content/50",
                )}
              >
                {toPersianNum(String(index + 1))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-base-content">
                  {product.name}
                </p>
                <p className="text-xs text-base-content/60">
                  {toPersianNum(String(product.sales))} فروش · {product.revenue}{" "}
                  تومان
                </p>
              </div>
              <span
                className={cn(
                  "text-xs font-semibold",
                  product.growth >= 0 ? "text-success" : "text-error",
                )}
              >
                {product.growth >= 0 ? "+" : ""}
                {toPersianNum(String(product.growth))}٪
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
