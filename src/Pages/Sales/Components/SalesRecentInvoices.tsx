import { useNavigate } from "react-router";
import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";
import { cn } from "../../../Utils/Cn";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: "paid" | "unpaid" | "overdue" | "cancelled";
  date: string;
  itemCount: number;
}

interface RecentInvoicesProps {
  invoices: Invoice[];
}

const statusConfig: Record<
  Invoice["status"],
  { label: string; badgeClass: string }
> = {
  paid: { label: "پرداخت شده", badgeClass: "badge-success" },
  unpaid: { label: "پرداخت نشده", badgeClass: "badge-warning" },
  overdue: { label: "سررسید گذشته", badgeClass: "badge-error" },
  cancelled: { label: "لغو شده", badgeClass: "badge-ghost" },
};

export default function SalesRecentInvoices({ invoices }: RecentInvoicesProps) {
  const navigate = useNavigate();

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-base">آخرین فاکتورها</h2>
          <span className="badge badge-ghost badge-sm">۵ فاکتور اخیر</span>
        </div>
        <div className="space-y-3">
          {recentInvoices.map((invoice) => {
            const config = statusConfig[invoice.status];
            return (
              <div
                key={invoice.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-base-50 border border-base-100 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => navigate(`/Sales/${invoice.id}`)}
              >
                {/* Invoice Icon */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-lg bg-base-200 flex items-center justify-center text-2xl">
                    📄
                  </div>
                  <span className={cn("badge badge-xs absolute -top-1.5 -right-1.5", config.badgeClass)}>
                    {config.label}
                  </span>
                </div>

                {/* Invoice Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {invoice.customerName}
                  </p>
                  <p className="text-xs text-base-content/50">
                    {invoice.invoiceNumber} · {formatNumber(invoice.itemCount)} قلم
                  </p>
                </div>

                {/* Amount */}
                <div className="text-left flex-shrink-0">
                  <p className="font-bold text-sm text-primary">
                    {formatCurrency(invoice.total)}
                  </p>
                  <p className="text-xs text-base-content/50">{invoice.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}