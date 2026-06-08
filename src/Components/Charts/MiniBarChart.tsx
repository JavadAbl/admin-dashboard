import { formatNumber } from "../../Utils/AppUtils";

const MiniBarChart: React.FC<{ data: { month: string; count: number }[] }> = ({
  data,
}) => {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-base-content/70">
            {formatNumber(item.count)}
          </span>
          <div
            className="w-full bg-primary/80 rounded-t-md transition-all duration-500 hover:bg-primary"
            style={{ height: `${(item.count / max) * 80}px` }}
          />
          <span className="text-[10px] text-base-content/50">{item.month}</span>
        </div>
      ))}
    </div>
  );
};

export default MiniBarChart;
