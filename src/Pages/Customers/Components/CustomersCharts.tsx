import React from "react";
import MiniBarChart from "../../../Components/Charts/MiniBarChart";
import { formatNumber } from "../../../Utils/AppUtils";

export default function CustomersCharts() {
  const totalCustomers = 412;

  const monthlyRegistrations = [
    { month: "مهر", count: 12 },
    { month: "آبان", count: 18 },
    { month: "آذر", count: 15 },
    { month: "دی", count: 24 },
    { month: "بهمن", count: 21 },
    { month: "اسفند", count: 28 },
  ];

  const cityDistribution = [
    { city: "تهران", count: 145, percent: 35 },
    { city: "اصفهان", count: 68, percent: 16 },
    { city: "شیراز", count: 52, percent: 13 },
    { city: "مشهد", count: 45, percent: 11 },
    { city: "تبریز", count: 38, percent: 9 },
    { city: "سایر", count: 64, percent: 16 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Registration Trend */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-base">روند ثبت‌نام مشتریان</h2>
            <span className="badge badge-ghost badge-sm">۶ ماه اخیر</span>
          </div>
          <MiniBarChart data={monthlyRegistrations} />
        </div>
      </div>

      {/* City Distribution */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-base">توزیع جغرافیایی مشتریان</h2>
            <span className="badge badge-ghost badge-sm">
              {formatNumber(totalCustomers)} نفر
            </span>
          </div>
          <CityDistribution data={cityDistribution} />
        </div>
      </div>
    </div>
  );
}

const CityDistribution: React.FC<{
  data: { city: string; count: number; percent: number }[];
}> = ({ data }) => (
  <div className="space-y-3">
    {data.map((item, i) => (
      <div key={i}>
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">{item.city}</span>
          <span className="text-base-content/60">
            {formatNumber(item.count)} نفر
          </span>
        </div>
        <progress
          className="progress progress-primary w-full h-2"
          value={item.percent}
          max="100"
        />
      </div>
    ))}
  </div>
);
