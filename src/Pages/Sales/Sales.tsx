import { formatCurrency, formatNumber } from "../../Utils/AppUtils";
import SalesStateCard from "./Components/SalesStateCard";
import SalesRecentInvoices from "./Components/SalesRecentInvoices";
import SalesOverdueAlertCard from "./Components/SalesOverdueAlertCard";
import SalesPaymentStatusChart from "./Components/SalesPaymentStatusChart";
import LoadingSpinner from "../../Components/Utils/LoadingSpinner";
import { useGetInvoices } from "../../Features/Sale/SaleApi";

// ============ Main Component ============
export default function SalesPage() {
  const { data: invoices, isLoading } = useGetInvoices();

  if (isLoading) return <LoadingSpinner centerScreen />;
  if (!invoices) return null;

  // Derived stats
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const unpaidInvoices = invoices.filter(
    (inv) => inv.status === "unpaid" || inv.status === "overdue",
  ).length;
  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">فاکتورها</h1>
          <p className="text-sm text-base-content/60 mt-1">
            مدیریت فروش، صدور فاکتور و پیگیری پرداخت‌ها
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
        <SalesStateCard
          title="کل فاکتورها"
          value={formatNumber(totalInvoices)}
          icon="📋"
          change="+۱۲ فاکتور این ماه"
          changeType="up"
        />
        <SalesStateCard
          title="پرداخت شده"
          value={formatNumber(paidInvoices)}
          icon="✅"
          description="تسویه شده"
        />
        <SalesStateCard
          title="پرداخت نشده"
          value={formatNumber(unpaidInvoices)}
          icon="⏳"
          change="نیاز به پیگیری"
          changeType="down"
          description="در انتظار تسویه"
        />
        <SalesStateCard
          title="درآمد کل"
          value={formatCurrency(totalRevenue)}
          icon="💰"
          change="+۲۳٪ نسبت به ماه قبل"
          changeType="up"
        />
      </div>

      {/* Recent Invoices & Overdue Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        {/* Recent Invoices */}
        <SalesRecentInvoices invoices={invoices} />

        {/* Overdue Alerts */}
        <SalesOverdueAlertCard invoices={invoices} />
      </div>

      {/* Payment Status Distribution */}
      <div className="card bg-base-100 shadow-sm mb-6">
        <div className="card-body p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-base">وضعیت پرداخت فاکتورها</h2>
            <span className="badge badge-ghost badge-sm">توزیع کلی</span>
          </div>
          <SalesPaymentStatusChart invoices={invoices} />
        </div>
      </div>
    </div>
  );
}
