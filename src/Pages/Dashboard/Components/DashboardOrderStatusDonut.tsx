import { toPersianNum } from "../../../Utils/AppUtils";
import Chart from "react-apexcharts";

export default function DashboardOrderStatusDonut() {
  const orderStatusOptions: ApexCharts.ApexOptions = {
    chart: { type: "donut", height: 260, fontFamily: "inherit" },
    labels: ["تکمیل شده", "در حال پردازش", "ارسال شده", "لغو شده"],
    colors: ["#22c55e", "#f59e0b", "#6366f1", "#ef4444"],
    stroke: { width: 2, colors: ["#ffffff"] },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontSize: "12px",
      labels: { colors: "#6b7280" },
      markers: { size: 6, shape: "square" },
      itemMargin: { horizontal: 8, vertical: 8 },
    },

    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: { show: true, fontSize: "13px", color: "#6b7280" },
            value: {
              show: true,
              fontSize: "22px",
              fontWeight: 700,
              color: "#111827",
              formatter: (val: string) => toPersianNum(val),
            },
          },
        },
      },
    },
  };

  const orderStatusSeries = [584, 236, 312, 152];

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-6">
        <div>
          <h2 className="text-lg font-semibold text-base-content">
            وضعیت سفارشات
          </h2>
          <p className="text-sm text-base-content/60">
            تفکیک بر اساس وضعیت فعلی
          </p>
        </div>
        <Chart
          options={orderStatusOptions}
          series={orderStatusSeries}
          type="donut"
          height={260}
        />
      </div>
    </div>
  );
}
