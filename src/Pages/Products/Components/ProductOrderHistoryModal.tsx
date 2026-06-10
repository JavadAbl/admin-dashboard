import { useState } from "react";
import { History } from "lucide-react";
import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";
import type { Product } from "../../../Features/Product/CustomerTypes/ProductType";
import Modal from "../../../Components/Modals/Modal";
import { useGetProductOrderHistoryByProductId } from "../../../Features/Product/ProductApi";
import LoadingSpinner from "../../../Components/Utils/LoadingSpinner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ProductOrderHistoryModal({
  isOpen,
  onClose,
  product,
}: Props) {
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");

  const { data, isLoading, error } = useGetProductOrderHistoryByProductId(
    product.id,
  );

  if (isLoading) return <LoadingSpinner centerScreen />;
  if (!data) return null;

  /*  const sortedSales = [...data].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.totalAmount - a.totalAmount;
  }); */

  const sortedSales = Array.from({ length: 100 }).map(() => data[0]);

  const totalRevenue = data.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalQuantity = data.reduce((sum, sale) => sum + sale.quantity, 0);
  const averageUnitPrice =
    data.length > 0
      ? data.reduce((sum, sale) => sum + sale.unitPrice, 0) / data.length
      : 0;

  return (
    <Modal
      title="تاریخچه فروش"
      description={product.name}
      isOpen={isOpen}
      onClose={onClose}
      icon={History}
      className=" min-w-fit h-full"
    >
      <div className="p-5 gap-4 flex flex-col h-full">
        {error && (
          <div className="alert alert-error">
            <svg
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2"
              />
            </svg>
            <span>{error.message}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-primary/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">کل فروش</p>
            <p className="font-bold text-sm text-primary">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="bg-success/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">تعداد واحد</p>
            <p className="font-bold text-sm text-success">
              {formatNumber(totalQuantity)}
            </p>
          </div>
          <div className="bg-info/10 rounded-lg p-3">
            <p className="text-xs text-base-content/70 mb-1">میانگین قیمت</p>
            <p className="font-bold text-sm text-info">
              {formatCurrency(averageUnitPrice)}
            </p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setSortBy("date")}
            className={`btn btn-xs ${
              sortBy === "date" ? "btn-primary" : "btn-ghost"
            }`}
          >
            جدیدترین
          </button>
          <button
            onClick={() => setSortBy("amount")}
            className={`btn btn-xs ${
              sortBy === "amount" ? "btn-primary" : "btn-ghost"
            }`}
          >
            بیشترین مبلغ
          </button>
        </div>

        {/* Sales Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : sortedSales.length === 0 ? (
            <div className="text-center py-12">
              <History size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm text-base-content/50">
                هیچ سابقه فروشی وجود ندارد
              </p>
            </div>
          ) : (
            <table className="table table-sm table-zebra ">
              <thead>
                <tr className="bg-base-300/70">
                  <th className="rounded-none text-xs">تاریخ</th>
                  <th className="text-xs">تعداد</th>
                  <th className="text-xs">قیمت واحد</th>
                  <th className="text-xs">مبلغ کل</th>
                  <th className="text-xs">نام خریدار</th>
                  <th className="rounded-none text-xs">شماره سفارش</th>
                </tr>
              </thead>
              <tbody>
                {sortedSales.map((sale) => (
                  <tr key={sale.id} className="text-xs">
                    <td dir="ltr" className="font-mono">
                      {new Date(sale.date).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="font-medium">
                      {formatNumber(sale.quantity)}
                    </td>
                    <td className="text-primary font-medium">
                      {formatCurrency(sale.unitPrice)}
                    </td>
                    <td className="text-success font-bold">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td>{sale.customerName}</td>
                    <td dir="ltr" className="font-mono">
                      <span className="badge badge-ghost badge-sm">
                        {sale.orderId}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
}
