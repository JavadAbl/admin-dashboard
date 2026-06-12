export type ReportPeriod = "monthly" | "quarterly" | "yearly" | "custom";
export type ReportType = "profit_loss" | "balance_sheet" | "cash_flow";

export interface ReportFilter {
  type: ReportType;
  period: ReportPeriod;
  fromDate: string;
  toDate: string;
}

// P&L
export interface ProfitLossData {
  revenue: { label: string; amount: number }[];
  costOfGoods: { label: string; amount: number }[];
  operatingExpenses: { label: string; amount: number }[];
  otherIncome: { label: string; amount: number }[];
  otherExpenses: { label: string; amount: number }[];
  totalRevenue: number;
  totalCostOfGoods: number;
  grossProfit: number;
  totalOperatingExpenses: number;
  operatingIncome: number;
  netIncome: number;
}

// Balance Sheet
export interface BalanceSheetData {
  assets: {
    current: { label: string; amount: number }[];
    fixed: { label: string; amount: number }[];
    totalAssets: number;
  };
  liabilities: {
    current: { label: string; amount: number }[];
    longTerm: { label: string; amount: number }[];
    totalLiabilities: number;
  };
  equity: {
    items: { label: string; amount: number }[];
    totalEquity: number;
  };
  totalLiabilitiesAndEquity: number;
}

// Cash Flow
export interface CashFlowData {
  operating: { label: string; amount: number }[];
  investing: { label: string; amount: number }[];
  financing: { label: string; amount: number }[];
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

export const reportTypeConfig: Record<
  ReportType,
  { label: string; description: string; icon: string }
> = {
  profit_loss: {
    label: "سود و زیان",
    description: "بررسی درآمدها، هزینه‌ها و سود خالص دوره",
    icon: "TrendingUp",
  },
  balance_sheet: {
    label: "ترازنامه",
    description: "وضعیت دارایی‌ها، بدهی‌ها و حقوق صاحبان سهام",
    icon: "Scale",
  },
  cash_flow: {
    label: "جریان نقدی",
    description: "ورود و خروج وجه نقد در عملیات، سرمایه‌گذاری و تأمین مالی",
    icon: "Banknote",
  },
};
