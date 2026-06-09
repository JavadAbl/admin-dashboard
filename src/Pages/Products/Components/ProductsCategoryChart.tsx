import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";
import { cn } from "../../../Utils/Cn";

interface CategoryChartProps {
  data: {
    category: string;
    count: number;
    revenue: number;
    percent: number;
  }[];
}

export default function ProductsCategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{item.category}</span>
            <span className="text-base-content/60 text-xs">
              {formatNumber(item.count)} کالا · {formatCurrency(item.revenue)}
            </span>
          </div>
          <div className={cn("w-full bg-base-200 rounded-full h-2.5")}>
            <div
              className={cn(
                "bg-primary h-2.5 rounded-full transition-all duration-500",
              )}
              style={{ width: `${item.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
