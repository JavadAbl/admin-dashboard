import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { ProfitLossData } from "../../../Features/Financial/FinancialTypes/FinancialType";
import { formatCurrency } from "../../../Utils/AppUtils";
import { cn } from "../../../Utils/Cn";

interface Props {
  data: ProfitLossData;
}

function SectionRow({
  label,
  amount,
  isTotal = false,
  isPositive,
  indent = false,
}: {
  label: string;
  amount: number;
  isTotal?: boolean;
  isPositive?: boolean;
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
            ? isPositive
              ? "text-success"
              : "text-error"
            : amount >= 0
              ? "text-base-content/80"
              : "text-error",
        )}
        dir="ltr"
      >
        {formatCurrency(amount)}
      </span>
    </div>
  );
}

export default function ProfitLossReport({ data }: Props) {
  const isProfit = data.netIncome >= 0;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl bg-success/5 p-4 ring-1 ring-success/20">
          <div className="mb-1 flex items-center gap-2 text-success">
            <ArrowUpRight size={16} />
            <span className="text-xs">درآمد کل</span>
          </div>
          <div className="text-xl font-bold text-success">
            {formatCurrency(data.totalRevenue)}
          </div>
        </div>
        <div className="rounded-xl bg-error/5 p-4 ring-1 ring-error/20">
          <div className="mb-1 flex items-center gap-2 text-error">
            <ArrowDownRight size={16} />
            <span className="text-xs">بهای تمام‌شده</span>
          </div>
          <div className="text-xl font-bold text-error">
            {formatCurrency(data.totalCostOfGoods)}
          </div>
        </div>
        <div className="rounded-xl bg-primary/5 p-4 ring-1 ring-primary/20">
          <div className="mb-1 flex items-center gap-2 text-primary">
            <DollarSign size={16} />
            <span className="text-xs">سود ناخالص</span>
          </div>
          <div className="text-xl font-bold text-primary">
            {formatCurrency(data.grossProfit)}
          </div>
        </div>
        <div
          className={cn(
            "rounded-xl p-4 ring-1",
            isProfit
              ? "bg-success/5 ring-success/20"
              : "bg-error/5 ring-error/20",
          )}
        >
          <div
            className={cn(
              "mb-1 flex items-center gap-2",
              isProfit ? "text-success" : "text-error",
            )}
          >
            {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-xs">سود خالص</span>
          </div>
          <div
            className={cn(
              "text-xl font-bold",
              isProfit ? "text-success" : "text-error",
            )}
          >
            {formatCurrency(data.netIncome)}
          </div>
        </div>
      </div>

      {/* Detailed P&L */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Revenue */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp size={14} className="text-success" />
              </div>
              <h3 className="font-semibold text-sm">درآمدها</h3>
            </div>
            {data.revenue.map((item, idx) => (
              <SectionRow
                key={idx}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}
            <SectionRow
              label="جمع درآمد"
              amount={data.totalRevenue}
              isTotal
              isPositive
            />
          </div>
        </div>

        {/* Cost of Goods */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-error/10">
                <TrendingDown size={14} className="text-error" />
              </div>
              <h3 className="font-semibold text-sm">بهای تمام‌شده کالا</h3>
            </div>
            {data.costOfGoods.map((item, idx) => (
              <SectionRow
                key={idx}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}
            <SectionRow
              label="جمع بهای تمام‌شده"
              amount={data.totalCostOfGoods}
              isTotal
              isPositive={false}
            />
          </div>
        </div>

        {/* Gross Profit & Operating Expenses */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign size={14} className="text-primary" />
              </div>
              <h3 className="font-semibold text-sm">سود ناخالص</h3>
            </div>
            <div className="rounded-xl bg-primary/5 p-4 ring-1 ring-primary/20 mb-3">
              <div className="text-xs text-base-content/60 mb-1">
                سود ناخالص
              </div>
              <div className="text-xl font-bold text-primary">
                {formatCurrency(data.grossProfit)}
              </div>
            </div>

            <h4 className="text-xs font-bold text-base-content/60 mt-2">
              هزینه‌های عملیاتی
            </h4>
            {data.operatingExpenses.map((item, idx) => (
              <SectionRow
                key={idx}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}
            <SectionRow
              label="جمع هزینه‌های عملیاتی"
              amount={data.totalOperatingExpenses}
              isTotal
              isPositive={false}
            />
          </div>
        </div>

        {/* Net Income */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg",
                  isProfit ? "bg-success/10" : "bg-error/10",
                )}
              >
                {isProfit ? (
                  <TrendingUp size={14} className="text-success" />
                ) : (
                  <TrendingDown size={14} className="text-error" />
                )}
              </div>
              <h3 className="font-semibold text-sm">سود خالص</h3>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-base-content/70">سود عملیاتی</span>
                <span className="font-mono" dir="ltr">
                  {formatCurrency(data.operatingIncome)}
                </span>
              </div>
            </div>

            {data.otherIncome.length > 0 && (
              <>
                <h4 className="text-xs font-bold text-base-content/60 mt-3">
                  سایر درآمدها
                </h4>
                {data.otherIncome.map((item, idx) => (
                  <SectionRow
                    key={idx}
                    label={item.label}
                    amount={item.amount}
                    indent
                  />
                ))}
              </>
            )}

            {data.otherExpenses.length > 0 && (
              <>
                <h4 className="text-xs font-bold text-base-content/60 mt-3">
                  سایر هزینه‌ها
                </h4>
                {data.otherExpenses.map((item, idx) => (
                  <SectionRow
                    key={idx}
                    label={item.label}
                    amount={item.amount}
                    indent
                  />
                ))}
              </>
            )}

            <div
              className={cn(
                "mt-3 rounded-xl p-4 ring-1",
                isProfit
                  ? "bg-success/5 ring-success/20"
                  : "bg-error/5 ring-error/20",
              )}
            >
              <div className="text-xs text-base-content/60 mb-1">
                سود (زیان) خالص
              </div>
              <div
                className={cn(
                  "text-2xl font-bold",
                  isProfit ? "text-success" : "text-error",
                )}
              >
                {formatCurrency(data.netIncome)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
