import {
  FileText,
  User,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ban,
  ArrowLeft,
  MoreVertical,
  Copy,
  Printer,
  RefreshCw,
  DollarSign,
  Receipt,
  Tag,
  TrendingUp,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import type {
  Invoice,
  InvoiceStatus,
} from "../../../../Features/Sale/SaleTypes/InvoiceType";
import {
  formatCurrency,
  formatNumber,
  toPersianDate,
} from "../../../../Utils/AppUtils";
import { useGetInvoices } from "../../../../Features/Sale/SaleApi";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  paid: {
    label: "پرداخت‌شده",
    color: "badge-success",
    icon: <CheckCircle2 size={14} />,
  },
  unpaid: {
    label: "پرداخت‌نشده",
    color: "badge-warning",
    icon: <Clock size={14} />,
  },
  overdue: {
    label: "سررسید گذشته",
    color: "badge-error",
    icon: <AlertTriangle size={14} />,
  },
  cancelled: {
    label: "لغو‌شده",
    color: "badge-ghost",
    icon: <Ban size={14} />,
  },
};

export default function InvoiceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: invoices } = useGetInvoices();

  const invoice = invoices?.find((item) => item.id === id);

  if (!invoices || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-base-content/40">
        <FileText size={48} className="mb-4" />
        <p className="font-medium">فاکتور یافت نشد</p>
        <button
          className="btn btn-ghost btn-sm mt-4"
          onClick={() => navigate("/Sales/Invoices")}
        >
          <ArrowLeft size={16} />
          بازگشت به لیست
        </button>
      </div>
    );
  }

  const currentStatus = statusConfig[invoice.status];
  const isOverdue = invoice.status === "overdue" && invoice.daysOverdue;
  const totalItems = invoice.items.reduce((s, it) => s + it.quantity, 0);
  const totalDiscount = invoice.items.reduce(
    (s, it) => s + (it.quantity * it.unitPrice * it.discount) / 100,
    0,
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-base-content">
                جزئیات فاکتور
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm gap-2">
              <RefreshCw size={16} />
              بروزرسانی
            </button>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm btn-square"
              >
                <MoreVertical size={16} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg"
              >
                <li>
                  <a className="gap-2">
                    <Printer size={16} />
                    چاپ فاکتور
                  </a>
                </li>
                <li>
                  <a
                    className="gap-2"
                    onClick={() =>
                      navigator.clipboard?.writeText(invoice.invoiceNumber)
                    }
                  >
                    <Copy size={16} />
                    کپی شماره فاکتور
                  </a>
                </li>
                {invoice.status !== "paid" &&
                  invoice.status !== "cancelled" && (
                    <li>
                      <a className="gap-2 text-error">
                        <Ban size={16} />
                        لغو فاکتور
                      </a>
                    </li>
                  )}
              </ul>
            </div>

            <button className="btn btn-ghost btn-circle btn-sm">
              <ArrowLeft
                size={20}
                onClick={() => navigate("/Sales/Invoices")}
              />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Right Column - Quick Info */}
          <div className="flex flex-col gap-3 lg:col-span-1 h-full">
            {/* Invoice Info Card */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Receipt size={24} className="text-primary" />
                  </div>
                  <span
                    className={`badge ${currentStatus.color} badge-lg gap-1 font-medium shadow-sm`}
                  >
                    {currentStatus.icon}
                    {currentStatus.label}
                  </span>
                </div>

                <h2
                  className="card-title text-lg leading-relaxed font-mono"
                  dir="ltr"
                >
                  {invoice.invoiceNumber}
                </h2>

                {invoice.note && (
                  <p className="text-xs text-base-content/60 bg-base-200 rounded-lg p-2 mt-1">
                    {invoice.note}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-sm flex-1">
              <div className="card-body">
                <h3 className="mb-3 font-semibold text-base-content/80">
                  دسترسی سریع
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn btn-outline btn-sm gap-2">
                    <Printer size={15} />
                    چاپ
                  </button>
                  {(invoice.status === "unpaid" ||
                    invoice.status === "overdue") && (
                    <button className="btn btn-outline btn-sm gap-2">
                      <CreditCard size={15} />
                      ثبت پرداخت
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm gap-2">
                    <Copy size={15} />
                    کپی لینک
                  </button>
                  <button className="btn btn-outline btn-sm gap-2">
                    <ShoppingCart size={15} />
                    سفارش جدید
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column - Details */}
          <div className="flex flex-col gap-3 lg:col-span-2 h-full">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <DollarSign size={16} className="text-primary" />
                  <span className="text-xs">مبلغ کل</span>
                </div>
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(invoice.total)}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <Tag size={16} className="text-success" />
                  <span className="text-xs">تخفیف کل</span>
                </div>
                <div className="text-lg font-bold text-success">
                  {formatCurrency(totalDiscount)}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <Package size={16} className="text-info" />
                  <span className="text-xs">تعداد اقلام</span>
                </div>
                <div className="text-lg font-bold text-info">
                  {formatNumber(totalItems)}{" "}
                  <span className="text-sm font-normal text-base-content/60">
                    عدد
                  </span>
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <CreditCard size={16} className="text-warning" />
                  <span className="text-xs">مالیات</span>
                </div>
                <div className="text-lg font-bold">
                  {formatCurrency(invoice.tax)}
                </div>
              </div>
            </div>

            {/* Overdue Warning */}
            {isOverdue && (
              <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error/5 p-4">
                <AlertTriangle size={20} className="shrink-0 text-error" />
                <div>
                  <p className="font-medium text-error">هشدار سررسید</p>
                  <p className="text-sm text-base-content/70">
                    این فاکتور{" "}
                    <span className="font-bold text-error">
                      {formatNumber(invoice.daysOverdue ?? 0)} روز
                    </span>{" "}
                    از سررسید گذشته است. لطفاً پیگیری لازم را انجام دهید.
                  </p>
                </div>
              </div>
            )}

            {/* Financial Breakdown */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                    <TrendingUp size={18} className="text-success" />
                  </div>
                  <h3 className="font-semibold">خلاصه مالی</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-primary/5 p-4 ring-1 ring-primary/20">
                    <div className="mb-1 text-xs text-base-content/60">
                      جمع اقلام
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {formatCurrency(invoice.subtotal)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-success/5 p-4 ring-1 ring-success/20">
                    <div className="mb-1 text-xs text-base-content/60">
                      تخفیف کل
                    </div>
                    <div className="text-xl font-bold text-success">
                      {formatCurrency(totalDiscount)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-info/5 p-4 ring-1 ring-info/20">
                    <div className="mb-1 text-xs text-base-content/60">
                      مالیات ارزش افزوده
                    </div>
                    <div className="text-xl font-bold text-info">
                      {formatCurrency(invoice.tax)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-base-200 p-4">
                  <div>
                    <div className="text-xs text-base-content/60">
                      مبلغ نهایی فاکتور
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {formatCurrency(invoice.total)}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-base-content/60">
                      وضعیت پرداخت
                    </div>
                    <span className={`badge ${currentStatus.color} gap-1 mt-1`}>
                      {currentStatus.icon}
                      {currentStatus.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items Table */}
            <div className="card bg-base-100 shadow-sm flex-1">
              <div className="card-body">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                    <Package size={18} className="text-warning" />
                  </div>
                  <h3 className="font-semibold">اقلام فاکتور</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="table table-sm table-zebra w-full">
                    <thead>
                      <tr className="bg-base-300/75 text-xs">
                        <th className="rounded-none">محصول</th>
                        <th>تعداد</th>
                        <th>قیمت واحد</th>
                        <th>تخفیف</th>
                        <th className="rounded-none">جمع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div>
                              <p className="font-medium text-sm">
                                {item.productName}
                              </p>
                              <p
                                className="text-[10px] text-base-content/40 font-mono"
                                dir="ltr"
                              >
                                {item.productId}
                              </p>
                            </div>
                          </td>
                          <td className="text-sm font-medium">
                            {formatNumber(item.quantity)}
                          </td>
                          <td className="text-sm text-primary whitespace-nowrap">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td>
                            {item.discount > 0 ? (
                              <span className="badge badge-success badge-sm">
                                {item.discount}٪
                              </span>
                            ) : (
                              <span className="text-xs text-base-content/40">
                                -
                              </span>
                            )}
                          </td>
                          <td className="text-sm font-bold whitespace-nowrap">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Info Table & Timeline */}
        <div className="flex gap-3">
          {/* Invoice Info Table */}
          <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
                  <FileText size={18} className="text-info" />
                </div>
                <h3 className="font-semibold">اطلاعات فاکتور</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <tbody>
                    <tr>
                      <td className="w-48">
                        <div className="flex items-center gap-2 text-base-content/60">
                          <FileText size={15} />
                          شماره فاکتور
                        </div>
                      </td>
                      <td className="font-mono font-medium" dir="ltr">
                        {invoice.invoiceNumber}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <User size={15} />
                          مشتری
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-ghost gap-1">
                          <User size={12} />
                          {invoice.customerName}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Calendar size={15} />
                          تاریخ صدور
                        </div>
                      </td>
                      <td>{toPersianDate(invoice.date)}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Clock size={15} />
                          سررسید پرداخت
                        </div>
                      </td>
                      <td className={isOverdue ? "text-error font-medium" : ""}>
                        {toPersianDate(invoice.dueDate)}
                        {isOverdue && (
                          <span className="text-xs mr-2">
                            ({formatNumber(invoice.daysOverdue ?? 0)} روز تأخیر)
                          </span>
                        )}
                      </td>
                    </tr>
                    {invoice.paidAt && (
                      <tr>
                        <td>
                          <div className="flex items-center gap-2 text-base-content/60">
                            <CreditCard size={15} />
                            تاریخ پرداخت
                          </div>
                        </td>
                        <td className="text-success font-medium">
                          {toPersianDate(invoice.paidAt)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Tag size={15} />
                          وضعیت
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${currentStatus.color} gap-1`}>
                          {currentStatus.icon}
                          {currentStatus.label}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Package size={15} />
                          شناسه فاکتور
                        </div>
                      </td>
                      <td className="font-mono">#{invoice.id}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Clock size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold">آخرین فعالیت‌ها</h3>
              </div>

              <ul className="timeline timeline-vertical timeline-compact">
                {invoice.status === "paid" && invoice.paidAt && (
                  <li>
                    <div className="timeline-middle">
                      <CheckCircle2 size={16} className="text-success" />
                    </div>
                    <div className="timeline-end timeline-box border-none bg-base-200">
                      <div className="text-sm font-medium">پرداخت ثبت شد</div>
                      <div className="text-xs text-base-content/60">
                        مبلغ {formatCurrency(invoice.total)} واریز شد
                      </div>
                    </div>
                    <hr />
                  </li>
                )}

                {invoice.status === "overdue" && (
                  <li>
                    <div className="timeline-middle">
                      <AlertTriangle size={16} className="text-error" />
                    </div>
                    <div className="timeline-end timeline-box border-none bg-base-200">
                      <div className="text-sm font-medium">سررسید گذشته</div>
                      <div className="text-xs text-base-content/60">
                        فاکتور از تاریخ سررسید پرداخت نشده است
                      </div>
                    </div>
                    <hr />
                  </li>
                )}

                {invoice.status === "cancelled" && (
                  <li>
                    <div className="timeline-middle">
                      <Ban size={16} className="text-base-content/40" />
                    </div>
                    <div className="timeline-end timeline-box border-none bg-base-200">
                      <div className="text-sm font-medium">فاکتور لغو شد</div>
                      <div className="text-xs text-base-content/60">
                        فاکتور توسط کاربر لغو گردید
                      </div>
                    </div>
                    <hr />
                  </li>
                )}

                <li>
                  <hr />
                  <div className="timeline-middle">
                    <FileText size={16} className="text-info" />
                  </div>
                  <div className="timeline-start timeline-box border-none bg-base-200">
                    <div className="text-sm font-medium">صدور فاکتور</div>
                    <div className="text-xs text-base-content/60">
                      فاکتور برای مشتری «{invoice.customerName}» صادر شد
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
