import React from "react";

const IconTrendingUp = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
    />
  </svg>
);

export default function DashboardHeader() {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-base-content">داشبورد</h1>
        <p className="mt-1 text-sm text-base-content/60">
          وضعیت فروش امروز شما را در یک نگاه ببینید.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <select className="select select-bordered select-sm">
          <option>۳۰ روز گذشته</option>
          <option>۷ روز گذشته</option>
          <option>۹۰ روز گذشته</option>
          <option>امسال</option>
        </select>
        <button className="btn btn-primary btn-sm gap-2">
          <IconTrendingUp className="h-4 w-4" />
          خروجی
        </button>
      </div>
    </div>
  );
}
