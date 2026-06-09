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

export default function ProductsTableView({ products }: Props) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr className="bg-base-200/50">
            <th className="rounded-none">محصول</th>
            <th>دسته‌بندی</th>
            <th>قیمت</th>
            <th>حاشیه سود</th>
            <th>موجودی</th>
            <th>فروش</th>
            <th>وضعیت</th>
            <th className="rounded-none"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const badge = getStatusBadge(product.status);
            const stock = getStockLevel(product.stock, product.minStock);
            const margin = getProfitMargin(product.price, product.costPrice);

            return (
              <tr key={product.id} className=" ">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center text-xl">
                      {product.image}
                    </div>
                    <div>
                      <p className="font-medium text-sm max-w-[250px] truncate">
                        {product.name}
                      </p>
                      <p
                        className="text-xs text-base-content/50 font-mono"
                        dir="ltr"
                      >
                        {product.sku}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-ghost badge-sm">
                    {product.category}
                  </span>
                </td>
                <td className="text-sm font-medium text-primary whitespace-nowrap">
                  {formatCurrency(product.price)}
                </td>
                <td>
                  <span
                    className={`text-sm font-medium ${
                      margin >= 25
                        ? "text-success"
                        : margin >= 15
                          ? "text-warning"
                          : "text-error"
                    }`}
                  >
                    {margin}٪
                  </span>
                </td>
                <td>
                  <div className="flex flex-col items-start">
                    <span className={`text-sm ${stock.cls}`}>
                      {formatNumber(product.stock)}
                    </span>
                    <span className="text-[10px] text-base-content/40">
                      حداقل: {formatNumber(product.minStock)}
                    </span>
                  </div>
                </td>
                <td className="text-sm font-medium">
                  {formatNumber(product.sold)}
                </td>
                <td>
                  <span className={`badge badge-sm ${badge.cls}`}>
                    {badge.label}
                  </span>
                </td>
                <td>
                  <div className="dropdown dropdown-left">
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-xs btn-circle"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-44 border border-base-200"
                    >
                      <li>
                        <a
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/Products/${product.id}`);
                          }}
                        >
                          مشاهده جزئیات
                        </a>
                      </li>

                      <li>
                        <a onClick={(e) => e.stopPropagation()}>ویرایش محصول</a>
                      </li>

                      <li>
                        <a onClick={(e) => e.stopPropagation()}>تاریخچه فروش</a>
                      </li>

                      <li>
                        <a onClick={(e) => e.stopPropagation()}>تنظیم موجودی</a>
                      </li>

                      <li>
                        <a onClick={(e) => e.stopPropagation()}>تغییر قیمت</a>
                      </li>

                      <li>
                        <a
                          className="text-error"
                          onClick={(e) => e.stopPropagation()}
                        >
                          حذف محصول
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
