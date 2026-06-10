import React from "react";
import { formatCurrency, formatNumber } from "../../Utils/AppUtils";
import { MockData } from "../../Utils/Api/MockData/MockData";
import { CategorySales } from "../../Features/Product/ProductEnums/CategoriesEnum";
import ProductsStockAlertCard from "./Components/ProductsStockAlertCard";
import ProductsCategoryChart from "./Components/ProductsCategoryChart";
import ProductsTopSelling from "./Components/ProductsTopSelling";
import ProductsStateCard from "./Components/ProductsStateCard";
import { useGetProducts } from "../../Features/Product/ProductApi";
import LoadingSpinner from "../../Components/Utils/LoadingSpinner";

// ============ Main Component ============
const ProductsPage: React.FC = () => {
  const { data: mockProducts, isLoading } = useGetProducts();

  if (isLoading) return <LoadingSpinner centerScreen />;
  if (!mockProducts) return null;

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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
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
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <ProductsStateCard
          title="کل محصولات"
          value={formatNumber(totalProducts)}
          icon="📦"
          change="+۸ محصول این ماه"
          changeType="up"
        />
        <ProductsStateCard
          title="محصولات فعال"
          value={formatNumber(activeProducts)}
          icon="✅"
          description="در حال فروش"
        />
        <ProductsStateCard
          title="ناموجود"
          value={formatNumber(outOfStock)}
          icon="🚫"
          change="نیاز به شارژ"
          changeType="down"
          description="موجودی صفر"
        />
        <ProductsStateCard
          title="ارزش موجودی"
          value={formatCurrency(totalInventoryValue)}
          icon="💎"
          change="+۱۵٪ نسبت به ماه قبل"
          changeType="up"
        />
      </div>

      {/* Top Selling & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        {/* Top Selling */}
        <ProductsTopSelling />

        {/* Stock Alerts */}
        <ProductsStockAlertCard products={mockProducts} />
      </div>

      {/* Category Distribution */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-base">فروش بر اساس دسته‌بندی</h2>
            <span className="badge badge-ghost badge-sm">درآمد کل</span>
          </div>
          <ProductsCategoryChart data={CategorySales} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
