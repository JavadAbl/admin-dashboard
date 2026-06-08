import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ============ Types ============
interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  sold: number;
  status: "active" | "inactive" | "draft";
  image: string;
  brand: string;
  createdAt: string;
}

// ============ Mock Data ============

const categorySales = [
  { category: "گوشی موبایل", count: 45, revenue: 4200000000, percent: 38 },
  { category: "لپ‌تاپ", count: 22, revenue: 2650000000, percent: 24 },
  { category: "لوازم جانبی", count: 68, revenue: 1500000000, percent: 14 },
  { category: "هدفون و هندزفری", count: 35, revenue: 1200000000, percent: 11 },
  { category: "ساعت هوشمند", count: 18, revenue: 850000000, percent: 8 },
  { category: "سایر", count: 25, revenue: 600000000, percent: 5 },
];

// ============ Helpers ============
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("fa-IR").format(value);
};

const toPersianDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
};

const getStatusBadge = (
  status: "active" | "inactive" | "draft",
): { cls: string; label: string } => {
  switch (status) {
    case "active":
      return { cls: "badge-success", label: "فعال" };
    case "inactive":
      return { cls: "badge-error", label: "ناموجود" };
    case "draft":
      return { cls: "badge-warning", label: "پیش‌نویس" };
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

// ============ Sub Components ============

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  description?: string;
}> = ({ title, value, icon, change, changeType = "neutral", description }) => (
  <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="card-body p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${
                changeType === "up"
                  ? "text-success"
                  : changeType === "down"
                    ? "text-error"
                    : "text-base-content/50"
              }`}
            >
              {changeType === "up" && "↑"}
              {changeType === "down" && "↓"}
              {change}
            </p>
          )}
          {description && (
            <p className="text-xs text-base-content/40 mt-0.5">{description}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const StockAlertCard: React.FC<{ products: Product[] }> = ({ products }) => {
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
                {product.stock === 0 ? (
                  <span className="badge badge-error badge-sm">ناموجود</span>
                ) : (
                  <span className="badge badge-warning badge-sm">
                    {formatNumber(product.stock)} عدد
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryChart: React.FC<{
  data: { category: string; count: number; revenue: number; percent: number }[];
}> = ({ data }) => (
  <div className="space-y-3">
    {data.map((item, i) => (
      <div key={i}>
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">{item.category}</span>
          <span className="text-base-content/60 text-xs">
            {formatNumber(item.count)} کالا · {formatCurrency(item.revenue)}
          </span>
        </div>
        <div className="w-full bg-base-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${item.percent}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

// ============ Main Component ============
const ProductsPage: React.FC = () => {
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

  // Derived stats
  const totalProducts = 156;
  const activeProducts = mockProducts.filter(
    (p) => p.status === "active",
  ).length;
  const outOfStock = mockProducts.filter(
    (p) => p.stock === 0 && p.status !== "draft",
  ).length;
  const totalInventoryValue = mockProducts.reduce(
    (sum, p) => sum + p.price * p.stock,
    0,
  );

  // Unique categories
  const categories = [...new Set(mockProducts.map((p) => p.category))];

  // Top selling
  const topSelling = [...mockProducts]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3);

  // Filtered & sorted
  const filteredProducts = mockProducts
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
    <div className="min-h-screen bg-base-200/50 p-4 md:p-6 lg:p-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">محصولات</h1>
          <p className="text-sm text-base-content/60 mt-1">
            مدیریت کالاها، موجودی و دسته‌بندی‌ها
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            خروجی اکسل
          </button>
          <button className="btn btn-primary btn-sm gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            افزودن محصول
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="کل محصولات"
          value={formatNumber(totalProducts)}
          icon="📦"
          change="+۸ محصول این ماه"
          changeType="up"
        />
        <StatCard
          title="محصولات فعال"
          value={formatNumber(activeProducts)}
          icon="✅"
          description="در حال فروش"
        />
        <StatCard
          title="ناموجود"
          value={formatNumber(outOfStock)}
          icon="🚫"
          change="نیاز به شارژ"
          changeType="down"
          description="موجودی صفر"
        />
        <StatCard
          title="ارزش موجودی"
          value={formatCurrency(totalInventoryValue)}
          icon="💎"
          change="+۱۵٪ نسبت به ماه قبل"
          changeType="up"
        />
      </div>

      {/* Top Selling & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Top Selling */}
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
                    <p className="font-medium text-sm truncate">
                      {product.name}
                    </p>
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

        {/* Stock Alerts */}
        <StockAlertCard products={mockProducts} />
      </div>

      {/* Category Distribution */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-base">فروش بر اساس دسته‌بندی</h2>
            <span className="badge badge-ghost badge-sm">درآمد کل</span>
          </div>
          <CategoryChart data={categorySales} />
        </div>
      </div>

      {/* Product List Section */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-0">
          {/* Toolbar */}
          <div className="p-4 border-b border-base-200">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {/* Search */}
              <div className="form-control flex-1">
                <div className="relative">
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="جستجو بر اساس نام، SKU یا برند..."
                    className="input input-bordered input-sm w-full pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
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

                {/* Category Filter */}
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

                {/* Stock Filter */}
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

                <div className="divider divider-vertical m-0 h-6 hidden lg:block" />

                {/* Sort */}
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
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button
                    className={`join-item btn btn-sm ${
                      viewMode === "grid" ? "btn-primary" : ""
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                      />
                    </svg>
                  </button>
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
                      <tr
                        key={product.id}
                        className="hover cursor-pointer"
                        onClick={() => navigate(`/Products/${product.id}`)}
                      >
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
                {formatNumber(totalProducts)} محصول
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
    </div>
  );
};

export default ProductsPage;
