import {
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "../../../Utils/AppUtils";
import type { CashFlowData } from "../../../Features/Financial/FinancialTypes/FinancialType";
import { cn } from "../../../Utils/Cn";

interface Props {
  data: CashFlowData;
}

function SectionRow({
  label,
  amount,
  isTotal = false,
  indent = false,
}: {
  label: string;
  amount: number;
  isTotal?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex justify-between items-center py-1.5",
        indent && "pr-6",
        isTotal && "border-t border-base-300 mt-1 pt-2 font-bold",
      )}
    >
      <span
        className={cn(
          "text-sm",
          isTotal && "font-bold",
          indent && !isTotal && "text-base-content/70",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-mono whitespace-nowrap",
          isTotal
            ? amount >= 0
              ? "text-success"
              : "text-error"
            : amount >= 0
              ? "text-success/80"
              : "text-error/80",
        )}
        dir="ltr"
      >
        {amount >= 0 ? "+" : ""}
        {formatCurrency(amount)}
      </span>
    </div>
  );
}

export default function CashFlowReport({ data }: Props) {
  const operatingTotal = data.operating.reduce((s, i) => s + i.amount, 0);
  const investingTotal = data.investing.reduce((s, i) => s + i.amount, 0);
  const financingTotal = data.financing.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div
          className={cn(
            "rounded-xl p-4 ring-1",
            operatingTotal >= 0
              ? "bg-success/5 ring-success/20"
              : "bg-error/5 ring-error/20",
          )}
        >
          <div className="mb-1 flex items-center gap-2">
            <ArrowUpRight
              size={16}
              className={operatingTotal >= 0 ? "text-success" : "text-error"}
            />
            <span className="text-xs text-base-content/70">عملیاتی</span>
          </div>
          <div
            className={cn(
              "text-xl font-bold",
              operatingTotal >= 0 ? "text-success" : "text-error",
            )}
          >
            {formatCurrency(operatingTotal)}
          </div>
        </div>
        <div
          className={cn(
            "rounded-xl p-4 ring-1",
            investingTotal >= 0
              ? "bg-info/5 ring-info/20"
              : "bg-warning/5 ring-warning/20",
          )}
        >
          <div className="mb-1 flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-info" />
            <span className="text-xs text-base-content/70">سرمایه‌گذاری</span>
          </div>
          <div
            className={cn(
              "text-xl font-bold",
              investingTotal >= 0 ? "text-info" : "text-warning",
            )}
          >
            {formatCurrency(investingTotal)}
          </div>
        </div>
        <div
          className={cn(
            "rounded-xl p-4 ring-1",
            financingTotal >= 0
              ? "bg-primary/5 ring-primary/20"
              : "bg-error/5 ring-error/20",
          )}
        >
          <div className="mb-1 flex items-center gap-2">
            <ArrowDownRight size={16} className="text-primary" />
            <span className="text-xs text-base-content/70">تأمین مالی</span>
          </div>
          <div className="text-xl font-bold text-primary">
            {formatCurrency(financingTotal)}
          </div>
        </div>
        <div
          className={cn(
            "rounded-xl p-4 ring-1",
            data.netCashFlow >= 0
              ? "bg-success/5 ring-success/20"
              : "bg-error/5 ring-error/20",
          )}
        >
          <div className="mb-1 flex items-center gap-2">
            <Wallet
              size={16}
              className={data.netCashFlow >= 0 ? "text-success" : "text-error"}
            />
            <span className="text-xs text-base-content/70">خالص جریان نقد</span>
          </div>
          <div
            className={cn(
              "text-xl font-bold",
              data.netCashFlow >= 0 ? "text-success" : "text-error",
            )}
          >
            {formatCurrency(data.netCashFlow)}
          </div>
        </div>
      </div>

      {/* Detailed Cash Flow */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Operating */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10">
                <ArrowUpRight size={14} className="text-success" />
              </div>
              <h3 className="font-semibold text-sm">فعالیت‌های عملیاتی</h3>
            </div>
            {data.operating.map((item, idx) => (
              <SectionRow
                key={idx}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}
            <SectionRow
              label="خالص وجه نقد عملیاتی"
              amount={operatingTotal}
              isTotal
            />
          </div>
        </div>

        {/* Investing */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info/10">
                <ArrowRightLeft size={14} className="text-info" />
              </div>
              <h3 className="font-semibold text-sm">فعالیت‌های سرمایه‌گذاری</h3>
            </div>
            {data.investing.map((item, idx) => (
              <SectionRow
                key={idx}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}
            <SectionRow
              label="خالص وجه نقد سرمایه‌گذاری"
              amount={investingTotal}
              isTotal
            />
          </div>
        </div>

        {/* Financing */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <ArrowDownRight size={14} className="text-primary" />
              </div>
              <h3 className="font-semibold text-sm">فعالیت‌های تأمین مالی</h3>
            </div>
            {data.financing.map((item, idx) => (
              <SectionRow
                key={idx}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}
            <SectionRow
              label="خالص وجه نقد تأمین مالی"
              amount={financingTotal}
              isTotal
            />
          </div>
        </div>

        {/* Net Summary */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg",
                  data.netCashFlow >= 0 ? "bg-success/10" : "bg-error/10",
                )}
              >
                <Banknote
                  size={14}
                  className={
                    data.netCashFlow >= 0 ? "text-success" : "text-error"
                  }
                />
              </div>
              <h3 className="font-semibold text-sm">خلاصه جریان نقدی</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/70">موجودی ابتدای دوره</span>
                <span className="font-mono" dir="ltr">
                  {formatCurrency(data.beginningCash)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base-content/70">خالص جریان نقدی</span>
                <span
                  className={cn(
                    "font-mono font-bold",
                    data.netCashFlow >= 0 ? "text-success" : "text-error",
                  )}
                  dir="ltr"
                >
                  {data.netCashFlow >= 0 ? "+" : ""}
                  {formatCurrency(data.netCashFlow)}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "mt-3 rounded-xl p-4 ring-1",
                data.endingCash >= 0
                  ? "bg-success/5 ring-success/20"
                  : "bg-error/5 ring-error/20",
              )}
            >
              <div className="text-xs text-base-content/60 mb-1">
                موجودی انتهای دوره
              </div>
              <div
                className={cn(
                  "text-2xl font-bold",
                  data.endingCash >= 0 ? "text-success" : "text-error",
                )}
              >
                {formatCurrency(data.endingCash)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
