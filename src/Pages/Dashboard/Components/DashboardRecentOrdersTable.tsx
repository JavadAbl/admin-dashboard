import { cn } from "../../../Utils/Cn";
import { useGetRecentOrders } from "../../../Features/App/AppApi";
import LoadingSpinner from "../../../Components/Utils/LoadingSpinner";

export default function DashboardRecentOrdersTable() {
  const { data: recentOrders, isLoading } = useGetRecentOrders();

  if (isLoading) return <LoadingSpinner />;
  if (!recentOrders) return null;
  return (
    <div className="card bg-base-100 shadow-sm xl:col-span-2">
      <div className="card-body p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-base-content">
              سفارشات اخیر
            </h2>
            <p className="text-sm text-base-content/60">
              آخرین تراکنش‌های فروشگاه شما
            </p>
          </div>
          <button className="btn btn-ghost btn-sm">مشاهده همه</button>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra table-sm">
            <thead>
              <tr className="border-b border-base-200">
                <th className="text-xs font-semibold uppercase text-base-content/50">
                  شناسه
                </th>
                <th className="text-xs font-semibold uppercase text-base-content/50">
                  مشتری
                </th>
                <th className="text-xs font-semibold uppercase text-base-content/50">
                  محصول
                </th>
                <th className="text-xs font-semibold uppercase text-base-content/50">
                  مبلغ (تومان)
                </th>
                <th className="text-xs font-semibold uppercase text-base-content/50">
                  وضعیت
                </th>
                <th className="text-xs font-semibold uppercase text-base-content/50">
                  تاریخ
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover">
                  <td className="font-medium text-primary">#{order.id}</td>
                  <td className="text-base-content/80">{order.customer}</td>
                  <td className="text-base-content/80">{order.product}</td>
                  <td className="font-semibold text-base-content">
                    {order.amount}
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="text-base-content/60">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "تکمیل شده": "badge-success badge-sm badge-outline",
    "در حال پردازش": "badge-warning badge-sm badge-outline",
    "ارسال شده": "badge-info badge-sm badge-outline",
    "لغو شده": "badge-error badge-sm badge-outline",
  };
  return (
    <span
      className={cn("badge font-medium", map[status] ?? "badge-ghost badge-sm")}
    >
      {status}
    </span>
  );
}
