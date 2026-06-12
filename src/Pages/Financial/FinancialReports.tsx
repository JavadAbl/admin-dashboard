import { useState } from "react";
import {
  TrendingUp,
  Scale,
  Banknote,
  Calendar,
  Download,
  RefreshCw,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import type {
  ReportPeriod,
  ReportType,
} from "../../Features/Financial/FinancialTypes/FinancialType";
import { cn } from "../../Utils/Cn";
import BalanceSheetReport from "./Components/BalanceSheetReport";
import CashFlowReport from "./Components/CashFlowReport";
import ProfitLossReport from "./Components/ProfitLossReport";

// ============ Mock Data ============
const mockProfitLoss = {
  revenue: [
    { label: "فروش کالا", amount: 850000000 },
    { label: "خدمات مشاوره", amount: 120000000 },
    { label: "سایر درآمدها", amount: 30000000 },
  ],
  costOfGoods: [
    { label: "خرید کالا", amount: 480000000 },
    { label: "هزینه حمل", amount: 25000000 },
  ],
  operatingExpenses: [
    { label: "حقوق و دستمزد", amount: 95000000 },
    { label: "اجاره", amount: 36000000 },
    { label: "استهلاک", amount: 18000000 },
    { label: "هزینه‌های اداری", amount: 22000000 },
    { label: "هزینه بازاریابی", amount: 15000000 },
  ],
  otherIncome: [{ label: "سود بانکی", amount: 8000000 }],
  otherExpenses: [{ label: "مالیات", amount: 45000000 }],
  totalRevenue: 1000000000,
  totalCostOfGoods: 505000000,
  grossProfit: 495000000,
  totalOperatingExpenses: 186000000,
  operatingIncome: 309000000,
  netIncome: 272000000,
};

const mockBalanceSheet = {
  assets: {
    current: [
      { label: "وجه نقد", amount: 320000000 },
      { label: "حساب‌های دریافتنی", amount: 180000000 },
      { label: "موجودی کالا", amount: 250000000 },
      { label: "پیش‌پرداخت‌ها", amount: 30000000 },
    ],
    fixed: [
      { label: "تجهیزات", amount: 400000000 },
      { label: "وسایل نقلیه", amount: 150000000 },
      { label: "کاهش استهلاک انباشته", amount: -120000000 },
    ],
    totalAssets: 1210000000,
  },
  liabilities: {
    current: [
      { label: "حساب‌های پرداختنی", amount: 200000000 },
      { label: "وام کوتاه‌مدت", amount: 80000000 },
      { label: "مالیات پرداختنی", amount: 45000000 },
    ],
    longTerm: [{ label: "وام بلندمدت", amount: 150000000 }],
    totalLiabilities: 475000000,
  },
  equity: {
    items: [
      { label: "سرمایه اولیه", amount: 500000000 },
      { label: "سود انباشته", amount: 235000000 },
    ],
    totalEquity: 735000000,
  },
  totalLiabilitiesAndEquity: 1210000000,
};

const mockCashFlow = {
  operating: [
    { label: "سود خالص", amount: 272000000 },
    { label: "استهلاک", amount: 18000000 },
    { label: "تغییر حساب‌های دریافتنی", amount: -45000000 },
    { label: "تغییر موجودی کالا", amount: -30000000 },
    { label: "تغییر حساب‌های پرداختنی", amount: 25000000 },
  ],
  investing: [
    { label: "خرید تجهیزات", amount: -80000000 },
    { label: "فروش دارایی", amount: 15000000 },
  ],
  financing: [
    { label: "دریافت وام", amount: 100000000 },
    { label: "بازپرداخت وام", amount: -40000000 },
  ],
  netCashFlow: 235000000,
  beginningCash: 320000000,
  endingCash: 555000000,
};

// ============ Report Types ============
const reportTypes: {
  key: ReportType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    key: "profit_loss",
    label: "سود و زیان",
    description: "بررسی درآمدها، هزینه‌ها و سود خالص دوره",
    icon: <TrendingUp size={20} />,
    color: "text-success",
  },
  {
    key: "balance_sheet",
    label: "ترازنامه",
    description: "وضعیت دارایی‌ها، بدهی‌ها و حقوق صاحبان سهام",
    icon: <Scale size={20} />,
    color: "text-primary",
  },
  {
    key: "cash_flow",
    label: "جریان نقدی",
    description: "ورود و خروج وجه نقد در عملیات، سرمایه‌گذاری و تأمین مالی",
    icon: <Banknote size={20} />,
    color: "text-info",
  },
];

const periodOptions: { key: ReportPeriod; label: string }[] = [
  { key: "monthly", label: "ماهانه" },
  { key: "quarterly", label: "فصلی" },
  { key: "yearly", label: "سالانه" },
];

// ============ Main Component ============
export default function FinancialReports() {
  const [selectedReport, setSelectedReport] =
    useState<ReportType>("profit_loss");
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("yearly");
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-12-29");

  const handleExport = () => {
    toast.success("گزارش در حال دانلود...");
  };

  const handleRefresh = () => {
    toast.info("بروزرسانی گزارش...");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Banknote size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-base-content">
                گزارشات مالی
              </h1>
              <p className="text-xs text-base-content/60">
                سود و زیان، ترازنامه و جریان نقدی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost btn-sm gap-2"
              onClick={handleRefresh}
            >
              <RefreshCw size={16} />
              بروزرسانی
            </button>
            <button
              className="btn btn-primary btn-sm gap-2"
              onClick={handleExport}
            >
              <Download size={16} />
              دانلود گزارش
            </button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="grid grid-cols-3 gap-3">
          {reportTypes.map((rt) => {
            const isSelected = selectedReport === rt.key;
            return (
              <button
                key={rt.key}
                className={`card shadow-sm border-2 transition-all text-right ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-base-100 hover:border-base-300"
                }`}
                onClick={() => setSelectedReport(rt.key)}
              >
                <div className="card-body p-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-primary/10" : "bg-base-200"
                      }`}
                    >
                      <span
                        className={
                          isSelected ? "text-primary" : "text-base-content/50"
                        }
                      >
                        {rt.icon}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="badge badge-primary badge-sm">فعال</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mt-2">{rt.label}</h3>
                  <p className="text-[10px] text-base-content/50 leading-relaxed line-clamp-2">
                    {rt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Period Filter */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-3">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-base-content/40" />
                <span className="text-xs font-bold text-base-content/60">
                  دوره گزارش:
                </span>
              </div>

              <div className="join">
                {periodOptions.map((p) => (
                  <button
                    key={p.key}
                    className={`join-item btn btn-sm ${selectedPeriod === p.key ? "btn-primary" : ""}`}
                    onClick={() => setSelectedPeriod(p.key)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="hidden lg:block w-px h-6 bg-base-200" />

              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-base-content/40" />
                <input
                  type="date"
                  className="input input-bordered input-xs"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <span className="text-xs text-base-content/50">تا</span>
                <input
                  type="date"
                  className="input input-bordered input-xs"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    selectedReport === "profit_loss"
                      ? "bg-success/10"
                      : selectedReport === "balance_sheet"
                        ? "bg-primary/10"
                        : "bg-info/10",
                  )}
                >
                  {reportTypes.find((r) => r.key === selectedReport)?.icon}
                </div>
                <h3 className="font-semibold">
                  {reportTypes.find((r) => r.key === selectedReport)?.label}
                </h3>
              </div>
              <span className="text-xs text-base-content/50">
                {periodOptions.find((p) => p.key === selectedPeriod)?.label}
              </span>
            </div>

            {selectedReport === "profit_loss" && (
              <ProfitLossReport data={mockProfitLoss} />
            )}
            {selectedReport === "balance_sheet" && (
              <BalanceSheetReport data={mockBalanceSheet} />
            )}
            {selectedReport === "cash_flow" && (
              <CashFlowReport data={mockCashFlow} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
