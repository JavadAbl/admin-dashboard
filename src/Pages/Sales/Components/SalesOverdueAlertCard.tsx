import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";
import { cn } from "../../../Utils/Cn";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: "paid" | "unpaid" | "overdue" | "cancelled";
  dueDate: string;
  daysOverdue?: number;
}

interface OverdueAlertCardProps {
  invoices: Invoice[];
}

export default function SalesOverdueAlertCard({
  invoices,
}: OverdueAlertCardProps) {
  const overdueInvoices = invoices
    .filter((inv) => inv.status === "overdue" || inv.status === "unpaid")
    .sort((a, b) => {
      const aDays = a.daysOverdue ?? 0;
      const bDays = b.daysOverdue ?? 0;
      return bDays - aDays;
    });

  if (overdueInvoices.length === 0) return null;

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-base flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-error" />
            </span>
            فاکتورهای معوق
          </h2>
          <span className="badge badge-error badge-outline badge-sm">
            {formatNumber(overdueInvoices.length)} فاکتور
          </span>
        </div>

        {/* List */}
        <div className="space-y-2 max-h-80 overflow-y-auto scroll-py-2">
          {overdueInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-box transition-colors",
                invoice.status === "overdue"
                  ? "bg-error/5 hover:bg-error/10 border border-error/10"
                  : "bg-base-200 hover:bg-base-300 border border-base-300",
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with Fallback */}
                <div className="avatar placeholder">
                  <div className="w-10 h-10 rounded-box mask mask-squircle bg-base-300 flex items-center justify-center text-lg">
                    {invoice.status === "overdue" ? "🔴" : "🟡"}
                  </div>
                </div>

                {/* Invoice Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {invoice.customerName}
                  </p>
                  <p className="text-xs text-base-content/50 font-mono tracking-tighter">
                    {invoice.invoiceNumber} · {invoice.dueDate}
                  </p>
                </div>
              </div>

              {/* Overdue Badge / Amount */}
              <div className="flex-shrink-0 ms-3 text-left">
                {invoice.status === "overdue" && invoice.daysOverdue ? (
                  <span className="badge badge-error badge-sm gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formatNumber(invoice.daysOverdue)} روز معوق
                  </span>
                ) : (
                  <span className="badge badge-warning badge-sm gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    در انتظار
                  </span>
                )}
                <p className="text-xs font-semibold text-base-content/70 mt-1">
                  {formatCurrency(invoice.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}