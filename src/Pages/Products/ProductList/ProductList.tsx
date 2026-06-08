import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";
import { useNavigate } from "react-router";
import { useGetProducts } from "../../../Features/Product/ProductApi";
import LoadingSpinner from "../../../Components/Utils/LoadingSpinner";
import { useState } from "react";
import { AlignJustify, Grid3X3, Search } from "lucide-react";

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

export default function ProductList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "draft"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<
    "all" | "inStock" | "lowStock" | "outOfStock"
  >("all");
  const [sortField, setSortField] = useState<
    "sold" | "price" | "stock" | "createdAt"
  >("sold");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const { data: products, isLoading: isLoadingProducts } = useGetProducts();

  if (isLoadingProducts) return <LoadingSpinner />;
  if (!products) return null;

  // Unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  // Filtered & sorted
  const filteredProducts = products
    .filter((p) => {
      const matchSearch =
        p.name.includes(searchQuery) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.includes(searchQuery);
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      const matchStock =
        stockFilter === "all" ||
        (stockFilter === "inStock" && p.stock > p.minStock) ||
        (stockFilter === "lowStock" && p.stock > 0 && p.stock <= p.minStock) ||
        (stockFilter === "outOfStock" && p.stock === 0);
      return matchSearch && matchStatus && matchCategory && matchStock;
    })
    .sort((a, b) => {
      if (sortField === "sold") return b.sold - a.sold;
      if (sortField === "price") return b.price - a.price;
      if (sortField === "stock") return a.stock - b.stock;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <>
      <div className="card bg-base-100 shadow-sm overflow-hidden h-full">
        <div className="card-body p-4 overflow-y-auto">
          {/* Toolbar */}

          <div className="border-b border-base-200 pb-4">
            <div className="flex flex-col gap-4">
              {/* Search - Full Width */}
              <div className="flex justify-between items-center">
                <div className="flex items-center form-control lg:w-[50%] xl:w-[35%] input input-bordered ">
                  <Search className=" w-4 h-4 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="جستجو بر اساس نام، SKU یا برند..."
                    className="input-sm "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary btn-sm">
                  {" + افزودن محصول"}
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* Status Filter */}
                <div className="join">
                  {(
                    [
                      { key: "all", label: "همه" },
                      { key: "active", label: "فعال" },
                      { key: "inactive", label: "ناموجود" },
                      { key: "draft", label: "پیش‌نویس" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.key}
                      className={`join-item btn btn-sm ${
                        statusFilter === f.key ? "btn-primary" : ""
                      }`}
                      onClick={() => setStatusFilter(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Category & Stock Filters Group */}
                <div className="flex items-center gap-2">
                  <select
                    className="select select-bordered select-sm"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">همه دسته‌ها</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <select
                    className="select select-bordered select-sm"
                    value={stockFilter}
                    onChange={(e) =>
                      setStockFilter(
                        e.target.value as
                          | "all"
                          | "inStock"
                          | "lowStock"
                          | "outOfStock",
                      )
                    }
                  >
                    <option value="all">همه موجودی</option>
                    <option value="inStock">موجود</option>
                    <option value="lowStock">کمبود</option>
                    <option value="outOfStock">ناموجود</option>
                  </select>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-6 bg-base-200" />

                {/* Sort & View Toggle Group */}
                <div className="flex items-center gap-2">
                  <select
                    className="select select-bordered select-sm"
                    value={sortField}
                    onChange={(e) =>
                      setSortField(
                        e.target.value as
                          | "sold"
                          | "price"
                          | "stock"
                          | "createdAt",
                      )
                    }
                  >
                    <option value="sold">مرتب: پرفروش‌ترین</option>
                    <option value="price">مرتب: گران‌ترین</option>
                    <option value="stock">مرتب: کمترین موجودی</option>
                    <option value="createdAt">مرتب: جدیدترین</option>
                  </select>

                  {/* View Toggle */}
                  <div className="join">
                    <button
                      className={`join-item btn btn-sm ${
                        viewMode === "table" ? "btn-primary" : ""
                      }`}
                      onClick={() => setViewMode("table")}
                    >
                      <AlignJustify className="w-4 h-4" />
                    </button>
                    <button
                      className={`join-item btn btn-sm ${
                        viewMode === "grid" ? "btn-primary" : ""
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="px-4 py-2 bg-base-200/30 text-xs text-base-content/50">
            نمایش {formatNumber(filteredProducts.length)} محصول
          </div>

          {/* Table View */}
          {viewMode === "table" ? (
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
                  {filteredProducts.map((product) => {
                    const badge = getStatusBadge(product.status);
                    const stock = getStockLevel(
                      product.stock,
                      product.minStock,
                    );
                    const margin = getProfitMargin(
                      product.price,
                      product.costPrice,
                    );

                    return (
                      <tr key={product.id} className="hover cursor-pointer">
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
                                <a onClick={(e) => e.stopPropagation()}>
                                  ویرایش محصول
                                </a>
                              </li>
                              <li>
                                <a onClick={(e) => e.stopPropagation()}>
                                  تاریخچه فروش
                                </a>
                              </li>
                              <li>
                                <a onClick={(e) => e.stopPropagation()}>
                                  تنظیم موجودی
                                </a>
                              </li>
                              <li>
                                <a onClick={(e) => e.stopPropagation()}>
                                  تغییر قیمت
                                </a>
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
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
              {filteredProducts.map((product) => {
                const badge = getStatusBadge(product.status);
                const stock = getStockLevel(product.stock, product.minStock);
                const margin = getProfitMargin(
                  product.price,
                  product.costPrice,
                );

                return (
                  <div
                    key={product.id}
                    className="card bg-base-50 border border-base-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/Products/${product.id}`)}
                  >
                    <div className="card-body p-4">
                      {/* Image & Status */}
                      <div className="flex items-start justify-between">
                        <div className="w-14 h-14 rounded-xl bg-base-200 flex items-center justify-center text-3xl">
                          {product.image}
                        </div>
                        <span className={`badge badge-sm ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>

                      {/* Info */}
                      <h3 className="font-bold text-sm mt-2 line-clamp-2 leading-relaxed">
                        {product.name}
                      </h3>
                      <p
                        className="text-xs text-base-content/50 font-mono"
                        dir="ltr"
                      >
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
                          <p
                            className={`font-bold text-sm mt-0.5 ${stock.cls}`}
                          >
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
                            e.stopPropagation();
                            navigate(`/Products/${product.id}`);
                          }}
                        >
                          جزئیات
                        </button>
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ویرایش
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-base-content/40">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="font-medium">محصولی یافت نشد</p>
              <p className="text-sm mt-1">فیلتر یا عبارت جستجو را تغییر دهید</p>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-base-200">
              <p className="text-xs text-base-content/50">
                نمایش ۱ تا {formatNumber(filteredProducts.length)} از{" "}
                {formatNumber(products.length)} محصول
              </p>
              <div className="join">
                <button className="join-item btn btn-sm btn-disabled">«</button>
                <button className="join-item btn btn-sm btn-primary">۱</button>
                <button className="join-item btn btn-sm">۲</button>
                <button className="join-item btn btn-sm">»</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
