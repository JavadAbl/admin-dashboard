import React from "react";
import { useNavigate } from "react-router";
import { formatCurrency, formatNumber } from "../../Utils/AppUtils";
import type { Product } from "../../Features/Product/CustomerTypes/ProductType";
import { MockData } from "../../Utils/Api/MockData";
import { CategorySales } from "../../Features/Product/ProductEnums/CategoriesEnum";

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
  const mockProducts = MockData.products;
  const navigate = useNavigate();

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

  // Top selling
  const topSelling = [...mockProducts]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
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
          <CategoryChart data={CategorySales} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
