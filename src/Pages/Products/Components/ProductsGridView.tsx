import { useNavigate } from "react-router";
import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";
import type { Product } from "../../../Features/Product/CustomerTypes/ProductType";

const getStatusBadge = (status: string): { cls: string; label: string } => {
  switch (status) {
    case "active":
      return { cls: "badge-success", label: "فعال" };
    case "inactive":
      return { cls: "badge-error", label: "ناموجود" };
    case "draft":
      return { cls: "badge-warning", label: "پیش‌نویس" };

    default:
      return { cls: "", label: "" };
  }
};

const getStockLevel = (
  stock: number,
  minStock: number,
): { cls: string; label: string } => {
  if (stock === 0) return { cls: "text-error font-bold", label: "ناموجود" };
  if (stock <= minStock)
    return { cls: "text-warning font-semibold", label: "کمبود" };
  return { cls: "text-success", label: "موجود" };
};

const getProfitMargin = (price: number, cost: number): number => {
  if (price === 0) return 0;
  return Math.round(((price - cost) / price) * 100);
};

interface Props {
  products: Product[];
}

export default function ProductsGridView({ products }: Props) {
  const navigate = useNavigate();

  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-4">
      {products.map((product) => {
        const badge = getStatusBadge(product.status);
        const stock = getStockLevel(product.stock, product.minStock);
        const margin = getProfitMargin(product.price, product.costPrice);

        return (
          <div
            key={product.id}
            className="card bg-base-200 shadow-md hover:shadow-inner shadow-primary/25 border border-base-300 transition-shadow "
          >
            <div className="card-body p-4">
              {/* Image & Status */}
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-xl bg-base-200 flex items-center justify-center text-3xl">
                  <img className="rounded-full" src={product.image} />
                </div>

                <span className={`badge badge-sm ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>

              {/* Info */}
              <h3 className="font-bold text-sm mt-2 line-clamp-2 leading-relaxed">
                {product.name}
              </h3>
              <p className="text-xs text-base-content/50 font-mono" dir="ltr">
                {product.sku}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-base-100 rounded-lg p-2 text-center">
                  <p className="text-base-content/40">قیمت</p>
                  <p className="font-bold text-primary text-sm mt-0.5">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <div className="bg-base-100 rounded-lg p-2 text-center">
                  <p className="text-base-content/40">فروش</p>
                  <p className="font-bold text-sm mt-0.5">
                    {formatNumber(product.sold)} عدد
                  </p>
                </div>
                <div className="bg-base-100 rounded-lg p-2 text-center">
                  <p className="text-base-content/40">موجودی</p>
                  <p className={`font-bold text-sm mt-0.5 ${stock.cls}`}>
                    {product.stock === 0
                      ? "ناموجود"
                      : formatNumber(product.stock)}
                  </p>
                </div>
                <div className="bg-base-100 rounded-lg p-2 text-center">
                  <p className="text-base-content/40">حاشیه سود</p>
                  <p
                    className={`font-bold text-sm mt-0.5 ${
                      margin >= 25
                        ? "text-success"
                        : margin >= 15
                          ? "text-warning"
                          : "text-error"
                    }`}
                  >
                    {margin}٪
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="card-actions justify-end mt-3">
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={(e) => {
                    navigate(`/Products/${product.id}`);
                  }}
                >
                  جزئیات
                </button>
                {/*   <button
                  className="btn btn-primary btn-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  ویرایش
                </button> */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
