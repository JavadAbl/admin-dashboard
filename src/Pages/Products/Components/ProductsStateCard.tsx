import { cn } from "../../../Utils/Cn";

interface Props {
  title: string;
  value: string;
  icon: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  description?: string;
}

export default function ProductsStateCard({
  title,
  value,
  icon,
  change,
  changeType = "neutral",
  description,
}: Props) {
  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-xs mt-1 flex items-center gap-1",
                  changeType === "up" && "text-success",
                  changeType === "down" && "text-error",
                  changeType === "neutral" && "text-base-content/50",
                )}
              >
                {changeType === "up" && "↑"}
                {changeType === "down" && "↓"}
                {change}
              </p>
            )}
            {description && (
              <p className="text-xs text-base-content/40 mt-0.5">
                {description}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
