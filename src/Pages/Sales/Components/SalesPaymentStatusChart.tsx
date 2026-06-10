import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";
import { cn } from "../../../Utils/Cn";

interface Invoice {
  id: string;
  total: number;
  status: "paid" | "unpaid" | "overdue" | "cancelled";
}

interface PaymentStatusChartProps {
  invoices: Invoice[];
}

const statusMeta: Record<
  Invoice["status"],
  { label: string; color: string; bgClass: string }
> = {
  paid: {
    label: "پرداخت شده",
    color: "bg-success",
    bgClass: "bg-success/10 text-success",
  },
  unpaid: {
    label: "پرداخت نشده",
    color: "bg-warning",
    bgClass: "bg-warning/10 text-warning",
  },
  overdue: {
    label: "سررسید گذشته",
    color: "bg-error",
    bgClass: "bg-error/10 text-error",
  },
  cancelled: {
    label: "لغو شده",
    color: "bg-base-300",
    bgClass: "bg-base-200 text-base-content/50",
  },
};

export default function SalesPaymentStatusChart({
  invoices,
}: PaymentStatusChartProps) {
  const total = invoices.length;
  if (total === 0) return null;

  // Group invoices by status
  const grouped = invoices.reduce(
    (acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate revenue per status
  const revenueByStatus = invoices.reduce(
    (acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + inv.total;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Build chart data
  const chartData = (Object.keys(statusMeta) as Invoice["status"][]).map(
    (status) => {
      const count = grouped[status] || 0;
      const revenue = revenueByStatus[status] || 0;
      return {
        status,
        label: statusMeta[status].label,
        count,
        revenue,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
        color: statusMeta[status].color,
        bgClass: statusMeta[status].bgClass,
      };
    },
  );

  return (
    <div className="space-y-3">
      {chartData.map((item) => (
        <div key={item.status}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium flex items-center gap-2">
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full inline-block",
                  item.color,
                )}
              />
              {item.label}
            </span>
            <span className="text-base-content/60 text-xs">
              {formatNumber(item.count)} فاکتور · {formatCurrency(item.revenue)}
            </span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-2.5">
            <div
              className={cn(
                "h-2.5 rounded-full transition-all duration-500",
                item.color,
              )}
              style={{ width: `${item.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}