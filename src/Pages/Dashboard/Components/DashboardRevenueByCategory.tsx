import { MoreVerticalIcon } from "lucide-react";
import Chart from "react-apexcharts";
import { toPersianNum } from "../../../Utils/AppUtils";

export default function DashboardRevenueByCategory() {
  const revenueByCategoryOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 320,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: { borderRadius: 6, columnWidth: "55%", distributed: true },
    },
    colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "الکترونیک",
        "لوازم جانبی",
        "پوشیدنی",
        "صوتی",
        "تجهیزات جانبی",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "11px" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px" },
        formatter: (val: number) => `${toPersianNum((val / 1000).toFixed(0))}M`,
      },
    },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) =>
          `${toPersianNum(val.toLocaleString())} تومان`,
      },
    },
    legend: { show: false },
  };

  const revenueByCategorySeries = [
    { name: "درآمد", data: [42500, 28300, 35800, 19400, 15200] },
  ];

  return (
    <div className="card bg-base-100 shadow-sm xl:col-span-2">
      <div className="card-body p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-base-content">
              درآمد بر اساس دسته‌بندی
            </h2>
            <p className="text-sm text-base-content/60">
              دسته‌بندی‌های برتر محصولات
            </p>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-xs btn-square"
            >
              <MoreVerticalIcon className="h-5 w-5" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu z-10 w-48 rounded-box bg-base-100 p-2 shadow-lg"
            >
              <li>
                <button>مرتب‌سازی بر اساس درآمد</button>
              </li>
              <li>
                <button>مرتب‌سازی بر اساس سفارشات</button>
              </li>
            </ul>
          </div>
        </div>
        <Chart
          options={revenueByCategoryOptions}
          series={revenueByCategorySeries}
          type="bar"
          height={320}
        />
      </div>
    </div>
  );
}
