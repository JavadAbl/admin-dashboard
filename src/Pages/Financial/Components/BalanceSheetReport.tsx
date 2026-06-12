import { Scale, Building2, CreditCard, Landmark, Wallet } from "lucide-react";
import type { BalanceSheetData } from "../../../Features/Financial/FinancialTypes/FinancialType";
import { formatCurrency } from "../../../Utils/AppUtils";
import { cn } from "../../../Utils/Cn";

interface Props {
  data: BalanceSheetData;
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
        className="text-sm font-mono whitespace-nowrap text-base-content/80"
        dir="ltr"
      >
        {formatCurrency(amount)}
      </span>
    </div>
  );
}

export default function BalanceSheetReport({ data }: Props) {
  const isBalanced = data.assets.totalAssets === data.totalLiabilitiesAndEquity;

  return (
    <div className="space-y-4">
      {/* Balance Check */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border p-3",
          isBalanced
            ? "border-success/30 bg-success/5"
            : "border-error/30 bg-error/5",
        )}
      >
        <Scale
          size={18}
          className={isBalanced ? "text-success" : "text-error"}
        />
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              isBalanced ? "text-success" : "text-error",
            )}
          >
            {isBalanced ? "ترازنامه متوازن است" : "ترازنامه نامتوازن است"}
          </p>
          <p className="text-xs text-base-content/70">
            دارایی‌ها = بدهی‌ها + حقوق صاحبان سهام
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-primary/5 p-4 ring-1 ring-primary/20">
          <div className="mb-1 flex items-center gap-2 text-primary">
            <Building2 size={16} />
            <span className="text-xs">کل دارایی‌ها</span>
          </div>
          <div className="text-xl font-bold text-primary">
            {formatCurrency(data.assets.totalAssets)}
          </div>
        </div>
        <div className="rounded-xl bg-error/5 p-4 ring-1 ring-error/20">
          <div className="mb-1 flex items-center gap-2 text-error">
            <CreditCard size={16} />
            <span className="text-xs">کل بدهی‌ها</span>
          </div>
          <div className="text-xl font-bold text-error">
            {formatCurrency(data.liabilities.totalLiabilities)}
          </div>
        </div>
        <div className="rounded-xl bg-success/5 p-4 ring-1 ring-success/20">
          <div className="mb-1 flex items-center gap-2 text-success">
            <Wallet size={16} />
            <span className="text-xs">حقوق صاحبان</span>
          </div>
          <div className="text-xl font-bold text-success">
            {formatCurrency(data.equity.totalEquity)}
          </div>
        </div>
      </div>

      {/* Detailed Balance Sheet */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Assets */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Building2 size={14} className="text-primary" />
              </div>
              <h3 className="font-semibold text-sm">دارایی‌ها</h3>
            </div>

            <h4 className="text-xs font-bold text-base-content/60">
              دارایی‌های جاری
            </h4>
            {data.assets.current.map((item, idx) => (
              <SectionRow
                key={`cur-${idx}`}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}

            <h4 className="text-xs font-bold text-base-content/60 mt-3">
              دارایی‌های ثابت
            </h4>
            {data.assets.fixed.map((item, idx) => (
              <SectionRow
                key={`fix-${idx}`}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}

            <SectionRow
              label="جمع دارایی‌ها"
              amount={data.assets.totalAssets}
              isTotal
            />
          </div>
        </div>

        {/* Liabilities & Equity */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-error/10">
                <Landmark size={14} className="text-error" />
              </div>
              <h3 className="font-semibold text-sm">بدهی‌ها و حقوق صاحبان</h3>
            </div>

            <h4 className="text-xs font-bold text-base-content/60">
              بدهی‌های جاری
            </h4>
            {data.liabilities.current.map((item, idx) => (
              <SectionRow
                key={`lc-${idx}`}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}

            <h4 className="text-xs font-bold text-base-content/60 mt-3">
              بدهی‌های بلندمدت
            </h4>
            {data.liabilities.longTerm.map((item, idx) => (
              <SectionRow
                key={`ll-${idx}`}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}

            <SectionRow
              label="جمع بدهی‌ها"
              amount={data.liabilities.totalLiabilities}
              isTotal
            />

            <h4 className="text-xs font-bold text-base-content/60 mt-3">
              حقوق صاحبان سهام
            </h4>
            {data.equity.items.map((item, idx) => (
              <SectionRow
                key={`eq-${idx}`}
                label={item.label}
                amount={item.amount}
                indent
              />
            ))}
            <SectionRow
              label="جمع حقوق صاحبان"
              amount={data.equity.totalEquity}
              isTotal
            />

            <div className="border-t-2 border-base-300 mt-2 pt-2">
              <SectionRow
                label="جمع بدهی‌ها و حقوق صاحبان"
                amount={data.totalLiabilitiesAndEquity}
                isTotal
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
