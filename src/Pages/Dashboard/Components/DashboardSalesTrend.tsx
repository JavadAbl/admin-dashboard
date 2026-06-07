import { MoreVerticalIcon } from "lucide-react";
import Chart from "react-apexcharts";
import { useGetPersianMonths } from "../../../Features/App/AppApi";
import { toPersianNum } from "../../../Utils/AppUtils";

export default function DashboardSalesTrend() {
  const { data: persianMonths } = useGetPersianMonths();

  const salesTrendOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 320,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#6366f1"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2.5 },
    xaxis: {
      categories: persianMonths,
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
  };

  const salesTrendSeries = [
    {
      name: "درآمد",
      data: [
        3200, 4100, 3800, 5200, 4800, 6100, 5700, 7200, 6800, 8100, 7600, 9200,
      ],
    },
  ];

  return (
    <div className="card bg-base-100 shadow-sm xl:col-span-2">
      <div className="card-body p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-base-content">
              نمای کلی فروش
            </h2>
            <p className="text-sm text-base-content/60">
              روند درآمد ماهانه سال ۱۴۰۳
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
              className="dropdown-content menu z-10 w-40 rounded-box bg-base-100 p-2 shadow-lg"
            >
              <li>
                <button>مشاهده جزئیات</button>
              </li>
              <li>
                <button>دانلود CSV</button>
              </li>
            </ul>
          </div>
        </div>
        <Chart
          options={salesTrendOptions}
          series={salesTrendSeries}
          type="area"
          height={320}
        />
      </div>
    </div>
  );
}
