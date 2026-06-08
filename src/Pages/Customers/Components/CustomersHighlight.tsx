import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";
import { useGetCustomers } from "../../../Features/Customer/CustomerApi";
import LoadingSpinner from "../../../Components/Utils/LoadingSpinner";
import Stars from "../../../Components/Utils/Stars";

export default function CustomersHighlight() {
  const { data: customers, isLoading } = useGetCustomers();

  if (isLoading) return <LoadingSpinner />;
  if (!customers) return null;

  const top3Customers = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {top3Customers.map((customer, index) => (
        <div
          key={customer.id}
          className={`card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 border-2 ${
            index === 0
              ? "border-warning/50"
              : index === 1
                ? "border-base-300/50"
                : "border-base-200/50"
          }`}
        >
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center text-2xl">
                  {customer.avatar}
                </div>
                <div
                  className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    index === 0
                      ? "bg-warning"
                      : index === 1
                        ? "bg-gray-400"
                        : "bg-amber-700"
                  }`}
                >
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{customer.name}</p>
                <p className="text-xs text-base-content/50 truncate">
                  {customer.city} · {customer.email}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/50">مجموع خرید</p>
                <p className="font-bold text-sm text-primary">
                  {formatCurrency(customer.totalSpent)}
                </p>
              </div>
              <div className="text-left">
                <p className="text-xs text-base-content/50">تعداد سفارش</p>
                <p className="font-bold text-sm">
                  {formatNumber(customer.totalPurchases)}
                </p>
              </div>
              <Stars rating={customer.rating} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
