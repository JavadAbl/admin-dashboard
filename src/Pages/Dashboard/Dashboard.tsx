import DashboardHeader from "./Components/DashboardHeader";
import DashboardKpi from "./Components/DashboardKpi";
import DashboardSalesTrend from "./Components/DashboardSalesTrend";
import DashboardOrderStatusDonut from "./Components/DashboardOrderStatusDonut";
import DashboardWeeklyOrders from "./Components/DashboardWeeklyOrders";
import DashboardRecentOrdersTable from "./Components/DashboardRecentOrdersTable";
import DashboardTopProducts from "./Components/DashboardTopProducts";
import DashboardRevenueByCategory from "./Components/DashboardRevenueByCategory";

// --- Main Component ---
export default function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      {/* KPI Cards */}
      <DashboardKpi />

      {/* Charts Row 1 */}
      <div className="mb-8 grid grid-cols-1 gap-2 xl:grid-cols-3">
        {/* Sales Trend */}
        <DashboardSalesTrend />

        {/* Order Status Donut */}
        <DashboardOrderStatusDonut />
      </div>

      {/* Charts Row 2 */}
      <div className="mb-8 grid grid-cols-1 gap-2 xl:grid-cols-3">
        {/* Revenue by Category */}
        <DashboardRevenueByCategory />

        {/* Weekly Orders */}
        <DashboardWeeklyOrders />
      </div>

      {/* Table + Top Products Row */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
        {/* Recent Orders Table */}
        <DashboardRecentOrdersTable />

        {/* Top Products */}
        <DashboardTopProducts />
      </div>
    </div>
  );
}
