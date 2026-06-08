import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";
import CustomerStateCard from "./CustomersStateCard";

export default function CustomersStatesRow() {
  const newThisMonth = 28;
  const activeCustomers = 347;
  const avgPurchaseValue = 4200000;
  const retentionRate = 84;
  const totalCustomers = 412;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <CustomerStateCard
        title="کل مشتریان"
        value={formatNumber(totalCustomers)}
        icon="👥"
        change="+۱۲٪ نسبت به ماه قبل"
        changeType="up"
      />
      <CustomerStateCard
        title="مشتریان جدید (این ماه)"
        value={formatNumber(newThisMonth)}
        icon="🆕"
        change="+۳۳٪ نسبت به ماه قبل"
        changeType="up"
      />
      <CustomerStateCard
        title="مشتریان فعال"
        value={formatNumber(activeCustomers)}
        icon="✅"
        change={`${retentionRate}٪ نرخ بازگشت`}
        changeType="up"
        description="خرید در ۳۰ روز اخیر"
      />
      <CustomerStateCard
        title="میانگین خرید هر مشتری"
        value={formatCurrency(avgPurchaseValue)}
        icon="💰"
        change="+۸٪ نسبت به ماه قبل"
        changeType="up"
      />
    </div>
  );
}
