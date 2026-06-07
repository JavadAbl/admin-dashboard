import { ArrowUpIcon } from "lucide-react";
import Chart from "react-apexcharts";
import { toPersianNum } from "../../../Utils/AppUtils";
import { useGetWeekDays } from "../../../Features/App/AppApi";

export default function DashboardWeeklyOrders() {
  const { data: weekDays } = useGetWeekDays();

  const weeklySalesOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 260,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "60%" } },
    colors: ["#e0e7ff"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: weekDays,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "11px" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px" },
        formatter: (val: number) => toPersianNum(String(val)),
      },
    },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val: number) => `${toPersianNum(String(val))} سفارش` },
    },
  };

  const weeklySalesSeries = [
    { name: "سفارشات", data: [42, 58, 35, 67, 82, 95, 63] },
  ];

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-6">
        <div>
          <h2 className="text-lg font-semibold text-base-content">
            سفارشات هفتگی
          </h2>
          <p className="text-sm text-base-content/60">
            سفارشات ثبت شده این هفته
          </p>
        </div>
        <Chart
          options={weeklySalesOptions}
          series={weeklySalesSeries}
          type="bar"
          height={260}
        />
        <div className="mt-2 flex items-center justify-between border-t border-base-200 pt-4">
          <div>
            <p className="text-xs text-base-content/60">مجموع این هفته</p>
            <p className="text-lg font-bold text-base-content">
              {toPersianNum("442")}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            <ArrowUpIcon className="h-3 w-3" />
            +۱۵.۳٪ نسبت به هفته قبل
          </div>
        </div>
      </div>
    </div>
  );
}
