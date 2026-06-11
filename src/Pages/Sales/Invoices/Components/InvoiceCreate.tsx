import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2, Receipt, User, Search } from "lucide-react";
import { useGetCustomers } from "../../../../Features/Customer/CustomerApi";
import { useGetProducts } from "../../../../Features/Product/ProductApi";
import { toPersianNum } from "../../../../Utils/AppUtils";

// ============ Types ============
interface InvoiceItemForm {
  productName: string;
  productId: string;
  quantity: string;
  unitPrice: string;
  discount: string;
  total: number;
}

interface CreateInvoiceForm {
  customerId: string;
  dueDate: string;
  note: string;
  items: InvoiceItemForm[];
}

const INITIAL_FORM: CreateInvoiceForm = {
  customerId: "",
  dueDate: "",
  note: "",
  items: [],
};

// ============ Helper ============
function calcItemTotal(qty: number, price: number, discountPct: number) {
  const subtotal = qty * price;
  const disc = subtotal * (discountPct / 100);
  return subtotal - disc;
}

// ============ Main Component ============
const InvoiceCreate: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvoiceForm>({
    defaultValues: INITIAL_FORM,
    mode: "onSubmit",
  });

  const [items, setItems] = useState<InvoiceItemForm[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [itemProductSearch, setItemProductSearch] = useState<
    Record<number, string>
  >({});
  const watchedNote = watch("note", "");
  const watchedCustomerId = watch("customerId");

  const { data: customers } = useGetCustomers();
  const { data: products } = useGetProducts();

  // Filtered customer list for search
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.trim().toLowerCase();
    return customers.filter(
      (c) =>
        c.name.includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.includes(q),
    );
  }, [customers, customerSearch]);

  // Selected customer object
  const selectedCustomer = useMemo(
    () => customers?.find((c) => String(c.id) === watchedCustomerId),
    [customers, watchedCustomerId],
  );

  // Products available for selection (exclude already-added products)
  const getAvailableProducts = useCallback(
    (itemIndex: number) => {
      if (!products) return [];
      const addedIds = items
        .filter((_, i) => i !== itemIndex)
        .map((it) => it.productId);
      const filtered = products.filter((p) => !addedIds.includes(String(p.id)));
      const search = (itemProductSearch[itemIndex] || "").trim().toLowerCase();
      if (!search) return filtered;
      return filtered.filter(
        (p) =>
          p.name.includes(search) ||
          p.sku.toLowerCase().includes(search) ||
          p.brand.includes(search),
      );
    },
    [products, items, itemProductSearch],
  );

  // Open / Close
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    if (isOpen && !modal.open) {
      reset(INITIAL_FORM);
      setItems([]);
      modal.showModal();
    } else if (!isOpen && modal.open) {
      modal.close();
    }
  }, [isOpen, reset]);

  const handleClose = useCallback(() => {
    reset(INITIAL_FORM);
    setItems([]);
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const handleCancel = (e: Event) => {
      handleClose();
    };
    modal.addEventListener("cancel", handleCancel);
    return () => modal.removeEventListener("cancel", handleCancel);
  }, [handleClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === modalRef.current) handleClose();
  };

  // ── Item management ──
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productName: "",
        productId: "",
        quantity: "1",
        unitPrice: "0",
        discount: "0",
        total: 0,
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItemForm,
    value: string,
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };
      const qty = parseInt(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const disc = parseFloat(item.discount) || 0;
      item.total = calcItemTotal(qty, price, disc);
      updated[index] = item;
      return updated;
    });
  };

  // ── Product selection handler ──
  const handleProductSelect = (index: number, productId: string) => {
    const product = products?.find((p) => String(p.id) === productId);
    if (!product) return;
    setItems((prev) => {
      const updated = [...prev];
      const qty = parseInt(updated[index].quantity) || 1;
      const disc = parseFloat(updated[index].discount) || 0;
      updated[index] = {
        ...updated[index],
        productName: product.name,
        productId: String(product.id),
        unitPrice: String(product.price),
        total: calcItemTotal(qty, product.price, disc),
      };
      return updated;
    });
    // Clear search for this item
    setItemProductSearch((prev) => ({ ...prev, [index]: "" }));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Computed values ──
  const subtotal = items.reduce((s, it) => {
    const qty = parseInt(it.quantity) || 0;
    const price = parseFloat(it.unitPrice) || 0;
    return s + qty * price;
  }, 0);

  const totalDiscount = items.reduce((s, it) => {
    const qty = parseInt(it.quantity) || 0;
    const price = parseFloat(it.unitPrice) || 0;
    const disc = parseFloat(it.discount) || 0;
    return s + (qty * price * disc) / 100;
  }, 0);

  const taxRate = 9; // 9% VAT in Iran
  const afterDiscount = subtotal - totalDiscount;
  const tax = Math.round(afterDiscount * (taxRate / 100));
  const grandTotal = afterDiscount + tax;

  const onFormSubmit = async (data: CreateInvoiceForm) => {
    if (items.length === 0) {
      toast.error("حداقل یک قلم به فاکتور اضافه کنید");
      return;
    }
    const hasEmptyItem = items.some((it) => !it.productId);
    if (hasEmptyItem) {
      toast.error("محصول برای همه اقلام الزامی است");
      return;
    }

    try {
      console.log({
        ...data,
        items,
        subtotal,
        tax,
        discount: totalDiscount,
        total: grandTotal,
      });
      toast.success("فاکتور با موفقیت ایجاد شد");
      handleClose();
    } catch {
      toast.error("خطا در ایجاد فاکتور. لطفاً دوباره تلاش کنید");
    }
  };

  return (
    <>
      <dialog
        ref={modalRef}
        className="modal modal-bottom sm:modal-middle"
        onClick={handleBackdropClick}
      >
        <div className="modal-box max-w-fit lg:max-w-4xl p-0 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-200/30 sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Receipt size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">فاکتور جدید</h3>
                <p className="text-xs text-base-content/50">
                  اطلاعات فاکتور و اقلام را وارد کنید
                </p>
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => handleClose()}
              disabled={isSubmitting}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form
            className="overflow-y-hidden flex-1 flex flex-col"
            onSubmit={handleSubmit(onFormSubmit)}
            noValidate
          >
            <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
              {/* Row 1: Customer & Due Date */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Customer Select */}
                <div className="flex-1">
                  <label className="label">
                    <span className="label-text font-medium">
                      مشتری <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    className={`select select-bordered select-sm w-full ${errors.customerId ? "select-error" : ""}`}
                    {...register("customerId", {
                      required: "انتخاب مشتری الزامی است",
                    })}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      انتخاب مشتری...
                    </option>
                    {filteredCustomers.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name} — {c.phone}
                      </option>
                    ))}
                  </select>
                  {errors.customerId && (
                    <p className="text-error text-xs mt-1">
                      {errors.customerId.message}
                    </p>
                  )}
                </div>

                <div className="lg:w-48">
                  <label className="label">
                    <span className="label-text font-medium">
                      سررسید پرداخت <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered input-sm w-full"
                    {...register("dueDate", {
                      required: "تاریخ سررسید الزامی است",
                    })}
                    disabled={isSubmitting}
                  />
                  {errors.dueDate && (
                    <p className="text-error text-xs mt-1">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Selected Customer Info Card */}
              {selectedCustomer && (
                <div className="flex items-center gap-4 bg-base-200/50 rounded-xl p-3 border border-base-300">
                  <div className="avatar placeholder">
                    <div className="w-11 h-11 rounded-full bg-primary/10">
                      <User size={18} className="text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {selectedCustomer.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-base-content/60 mt-0.5">
                      <span dir="ltr">{selectedCustomer.phone}</span>
                      <span className="hidden sm:inline">|</span>
                      <span>{selectedCustomer.city}</span>
                      <span className="hidden sm:inline">|</span>
                      <span dir="ltr" className="hidden sm:inline">
                        {selectedCustomer.email}
                      </span>
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-[10px] text-base-content/50">خرید کل</p>
                    <p className="text-xs font-bold text-primary">
                      {selectedCustomer.totalPurchases} سفارش
                    </p>
                  </div>
                </div>
              )}

              {/* Items Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">اقلام فاکتور</h4>
                  <button
                    type="button"
                    className="btn btn-primary btn-xs gap-1"
                    onClick={addItem}
                    disabled={isSubmitting}
                  >
                    <Plus size={14} />
                    افزودن قلم
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-base-content/30 border-2 border-dashed border-base-300 rounded-xl">
                    <Receipt size={32} className="mb-2" />
                    <p className="text-sm">هنوز قلمی اضافه نشده است</p>
                    <p className="text-xs mt-1">روی «افزودن قلم» کلیک کنید</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Items Header */}
                    <div className="hidden md:grid grid-cols-12 gap-2 text-xs text-base-content/50 px-2">
                      <span className="col-span-4">محصول</span>
                      <span className="col-span-1">تعداد</span>
                      <span className="col-span-2">قیمت واحد</span>
                      <span className="col-span-1">تخفیف ٪</span>
                      <span className="col-span-2">جمع</span>
                      <span className="col-span-2"></span>
                    </div>

                    {items.map((item, idx) => {
                      const availableProducts = getAvailableProducts(idx);
                      const selectedProduct = products?.find(
                        (p) => String(p.id) === item.productId,
                      );
                      const isOutOfStock =
                        selectedProduct && selectedProduct.stock === 0;

                      return (
                        <div
                          key={idx}
                          className="bg-base-200 rounded-xl p-3 space-y-2"
                        >
                          {/* Product Select Row */}
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              {item.productId ? (
                                <div className="flex items-center gap-2 bg-base-100 rounded-lg px-3 py-2">
                                  {selectedProduct && (
                                    <img
                                      src={selectedProduct.image}
                                      className="w-7 h-7 rounded-full"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {item.productName}
                                    </p>
                                    {selectedProduct && (
                                      <p
                                        className="text-[10px] text-base-content/40 font-mono"
                                        dir="ltr"
                                      >
                                        {selectedProduct.sku}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-xs btn-circle text-error"
                                    onClick={() => {
                                      setItems((prev) => {
                                        const updated = [...prev];
                                        updated[idx] = {
                                          productName: "",
                                          productId: "",
                                          quantity: "1",
                                          unitPrice: "0",
                                          discount: "0",
                                          total: 0,
                                        };
                                        return updated;
                                      });
                                    }}
                                    disabled={isSubmitting}
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <select
                                  className="select select-bordered select-sm w-full"
                                  value=""
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleProductSelect(idx, e.target.value);
                                    }
                                  }}
                                  disabled={isSubmitting}
                                >
                                  <option value="" disabled>
                                    انتخاب محصول...
                                  </option>
                                  {availableProducts.map((p) => (
                                    <option key={p.id} value={String(p.id)}>
                                      {p.name} — {p.brand} (SKU: {p.sku})
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                            <button
                              type="button"
                              className="btn btn-ghost btn-xs btn-circle text-error shrink-0"
                              onClick={() => removeItem(idx)}
                              disabled={isSubmitting}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Quantity / Price / Discount / Total Row */}
                          {item.productId && (
                            <>
                              {isOutOfStock && (
                                <div className="flex items-center gap-1.5 text-[11px] text-error font-medium bg-error/10 rounded-lg px-2.5 py-1.5">
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  این محصول ناموجود است
                                </div>
                              )}
                              <div className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-3">
                                  <label className="label py-0">
                                    <span className="label-text-alt text-base-content/50">
                                      تعداد
                                    </span>
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max={selectedProduct?.stock || 9999}
                                    className="input input-bordered input-sm w-full"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateItem(
                                        idx,
                                        "quantity",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isSubmitting}
                                  />
                                  {selectedProduct && (
                                    <p className="text-[10px] text-base-content/40 mt-0.5">
                                      موجودی: {selectedProduct.stock} عدد
                                    </p>
                                  )}
                                </div>
                                <div className="col-span-3">
                                  <label className="label py-0">
                                    <span className="label-text-alt text-base-content/50">
                                      قیمت واحد
                                    </span>
                                  </label>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    dir="ltr"
                                    className="input input-bordered input-sm w-full text-left font-mono"
                                    value={item.unitPrice}
                                    onChange={(e) =>
                                      updateItem(
                                        idx,
                                        "unitPrice",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isSubmitting}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="label py-0">
                                    <span className="label-text-alt text-base-content/50">
                                      تخفیف ٪
                                    </span>
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="input input-bordered input-sm w-full"
                                    value={item.discount}
                                    onChange={(e) =>
                                      updateItem(
                                        idx,
                                        "discount",
                                        e.target.value,
                                      )
                                    }
                                    disabled={isSubmitting}
                                  />
                                </div>
                                <div className="col-span-4 flex items-end justify-end">
                                  <div className="text-right">
                                    <p className="text-[10px] text-base-content/40 mb-1">
                                      جمع قلم
                                    </p>
                                    <p className="text-sm font-bold text-primary">
                                      {item.total.toLocaleString("fa-IR")} تومان
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Totals */}
              {items.length > 0 && (
                <div className="bg-base-200/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/60">جمع اقلام:</span>
                    <span className="font-medium">
                      {subtotal.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/60">تخفیف:</span>
                      <span className="font-medium text-success">
                        -{totalDiscount.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/60">
                      مالیات ارزش افزوده ({toPersianNum(taxRate.toString())}٪):
                    </span>
                    <span className="font-medium">
                      {tax.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                  <div className="h-px bg-base-300 my-1" />
                  <div className="flex justify-between">
                    <span className="font-bold">مبلغ نهایی:</span>
                    <span className="font-bold text-primary text-lg">
                      {grandTotal.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">یادداشت</span>
                </label>
                <textarea
                  className="textarea textarea-bordered textarea-sm w-full h-20 resize-none"
                  placeholder="توضیحات مختصر (اختیاری)"
                  {...register("note", {
                    maxLength: { value: 500, message: "حداکثر ۵۰۰ کاراکتر" },
                  })}
                  disabled={isSubmitting}
                />
                <label className="label justify-start gap-2">
                  <span className="label-text-alt text-base-content/40">
                    {toPersianNum(watchedNote.length.toString())} / ۵۰۰
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-200/30 shrink-0">
              <p className="text-xs text-base-content/40">
                <span className="text-error">*</span> فیلدهای الزامی
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary btn-sm gap-2 min-w-30 ${
                    isSubmitting ? "loading" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {isSubmitting ? "در حال ایجاد..." : "ایجاد فاکتور"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => handleClose()}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default InvoiceCreate;
