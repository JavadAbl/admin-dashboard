import { useGetKpiData } from "../../../Features/App/AppApi";
import { cn } from "../../../Utils/Cn";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSignIcon,
  PackageIcon,
  ShoppingCartIcon,
  Users2Icon,
} from "lucide-react";

const icons = [
  {
    icon: <DollarSignIcon className="h-5 w-5" />,
    iconBg: "bg-primary/10 text-primary",
  },
  {
    icon: <ShoppingCartIcon />,
    iconBg: "bg-secondary/10 text-secondary",
  },
  {
    icon: <Users2Icon />,
    iconBg: "bg-accent/10 text-accent",
  },
  {
    icon: <PackageIcon />,
    iconBg: "bg-success/10 text-success",
  },
];

export default function DashboardKpi() {
  const { data: kpiData } = useGetKpiData();

  if (!kpiData) return null;
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiData.map((kpi, index) => {
        const Icon = icons[index].icon;
        const iconBg = icons[index].iconBg;
        return (
          <div key={kpi.title} className="card bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    iconBg,
                  )}
                >
                  {Icon}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                    kpi.trend === "up"
                      ? "bg-success/10 text-success"
                      : "bg-error/10 text-error",
                  )}
                >
                  {kpi.trend === "up" ? (
                    <ArrowUpIcon className="h-3 w-3" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-base-content/60">{kpi.title}</p>
                <p className="mt-1 text-xl font-bold tracking-tight text-base-content">
                  {kpi.value.toLocaleString()}
                  <span className="mr-2 text-xs font-normal text-base-content/50">
                    {kpi.unit}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
