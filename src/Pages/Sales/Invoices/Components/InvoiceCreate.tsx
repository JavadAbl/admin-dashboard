import React, { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Receipt,
  Search,
  X,
  Check,
  Package,
  Phone,
} from "lucide-react";
import { useGetCustomers } from "../../../../Features/Customer/CustomerApi";
import { useGetProducts } from "../../../../Features/Product/ProductApi";
import { toPersianNum } from "../../../../Utils/AppUtils";
import { cn } from "../../../../Utils/Cn";
import Modal from "../../../../Components/Modals/Modal";
import Input from "../../../../Components/Inputs/Input";

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
export default function InvoiceCreate({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);

  const [productSearch, setProductSearch] = useState("");
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  const watchedCustomerId = watch("customerId");

  const { data: customers } = useGetCustomers();
  const { data: products } = useGetProducts();

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.trim().toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q),
    );
  }, [customers, customerSearch]);

  const selectedCustomer = useMemo(
    () => customers?.find((c) => String(c.id) === watchedCustomerId),
    [customers, watchedCustomerId],
  );

  const availableProducts = useMemo(() => {
    if (!products) return [];
    const addedIds = items.map((it) => it.productId);
    let filtered = products.filter((p) => !addedIds.includes(String(p.id)));

    const search = productSearch.trim().toLowerCase();
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku?.toLowerCase().includes(search) ||
          p.brand?.toLowerCase().includes(search),
      );
    }
    return filtered;
  }, [products, items, productSearch]);

  const selectedProductToAdd = useMemo(
    () => products?.find((p) => String(p.id) === selectedProductId),
    [products, selectedProductId],
  );

  React.useEffect(() => {
    if (isOpen) {
      reset(INITIAL_FORM);
      setItems([]);
      setCustomerSearch("");
      setProductSearch("");
      setSelectedProductId("");
      setIsCustomerOpen(false);
      setIsProductDropdownOpen(false);
    }
  }, [isOpen, reset]);

  const handleClose = useCallback(() => {
    reset(INITIAL_FORM);
    setItems([]);
    onClose();
  }, [onClose, reset]);

  const handleAddItem = () => {
    if (!selectedProductToAdd) {
      toast.error("لطفاً ابتدا یک محصول انتخاب کنید");
      return;
    }
    const priceNum = parseFloat(String(selectedProductToAdd.price)) || 0;
    setItems((prev) => [
      ...prev,
      {
        productName: selectedProductToAdd.name,
        productId: String(selectedProductToAdd.id),
        quantity: "1",
        unitPrice: String(priceNum),
        discount: "0",
        total: calcItemTotal(1, priceNum, 0),
      },
    ]);
    setSelectedProductId("");
    setProductSearch("");
    setIsProductDropdownOpen(false);
  };

  const updateItemQuantity = (index: number, value: string) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], quantity: value };
      const qty = parseInt(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      const disc = parseFloat(item.discount) || 0;
      item.total = calcItemTotal(qty, price, disc);
      updated[index] = item;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (s, it) =>
      s + (parseInt(it.quantity) || 0) * (parseFloat(it.unitPrice) || 0),
    0,
  );
  const totalDiscount = items.reduce((s, it) => {
    const qty = parseInt(it.quantity) || 0;
    const price = parseFloat(it.unitPrice) || 0;
    const disc = parseFloat(it.discount) || 0;
    return s + (qty * price * disc) / 100;
  }, 0);

  const taxRate = 9;
  const afterDiscount = subtotal - totalDiscount;
  const tax = Math.round(afterDiscount * (taxRate / 100));
  const grandTotal = afterDiscount + tax;

  const onFormSubmit = async (data: CreateInvoiceForm) => {
    if (items.length === 0) {
      toast.error("حداقل یک قلم به فاکتور اضافه کنید");
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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="فاکتور جدید"
      description="اطلاعات مشتری و اقلام را وارد کنید"
      icon={Receipt}
      className="max-w-3xl h-full min-h-150"
    >
      <form
        className="flex flex-col h-full overflow-hidden"
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
      >
        <div className="flex flex-col gap-4 px-6 py-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* Row 1: Customer & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
            <div className="md:col-span-2">
              <label className="label py-1">
                <span className="label-text text-xs font-bold">
                  مشتری <span className="text-error">*</span>
                </span>
              </label>
              <div
                className="relative"
                tabIndex={-1}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node))
                    setIsCustomerOpen(false);
                }}
              >
                <div
                  className={cn(
                    "input input-bordered input-sm w-full flex items-center gap-2 cursor-pointer",
                    errors.customerId
                      ? "input-error"
                      : "hover:border-base-content/40",
                  )}
                  onClick={() => setIsCustomerOpen(!isCustomerOpen)}
                >
                  <Search size={14} className="text-base-content/50 shrink-0" />
                  <span
                    className={cn(
                      "flex-1 truncate text-sm",
                      !selectedCustomer && "text-base-content/50",
                    )}
                  >
                    {selectedCustomer
                      ? selectedCustomer.name
                      : "انتخاب مشتری..."}
                  </span>
                  {selectedCustomer && (
                    <span
                      className="flex items-center gap-1 text-xs text-base-content/70 bg-base-200 rounded-full px-2 py-0.5"
                      dir="ltr"
                    >
                      <Phone size={10} /> {selectedCustomer.phone}
                    </span>
                  )}
                  {selectedCustomer && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs btn-circle hover:bg-error/10 hover:text-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("customerId", "");
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                {isCustomerOpen && (
                  <div className="absolute z-30 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl max-h-56 overflow-y-auto">
                    <div className="p-2 border-b border-base-200 sticky top-0 bg-base-100 z-10">
                      <input
                        type="text"
                        className="input input-xs w-full"
                        placeholder="جستجوی نام، موبایل یا شهر..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className="menu p-1 compact">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((c) => (
                          <li key={c.id}>
                            <a
                              className="flex items-center justify-between py-2"
                              onClick={() => {
                                setValue("customerId", String(c.id));
                                setIsCustomerOpen(false);
                                setCustomerSearch("");
                              }}
                            >
                              <span className="font-medium text-sm">
                                {c.name}
                              </span>
                              <span
                                className="text-xs text-base-content/60"
                                dir="ltr"
                              >
                                {c.phone} | {c.city}
                              </span>
                            </a>
                          </li>
                        ))
                      ) : (
                        <li className="text-center text-sm text-base-content/50 p-4">
                          مشتری یافت نشد
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                <input
                  type="hidden"
                  {...register("customerId", {
                    required: "انتخاب مشتری الزامی است",
                  })}
                />
                {errors.customerId && (
                  <p className="text-error text-xs mt-1">
                    {errors.customerId.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-xs font-bold">
                  تاریخ سررسید <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="date"
                className={cn(
                  "input input-bordered input-sm w-full",
                  errors.dueDate && "input-error",
                )}
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

          {/* Product Selection & Items Table Area */}
          <div className="border border-base-300 rounded-lg flex-1">
            {/* Inline Add Product Bar */}
            <div className="flex justify-between items-center gap-2 p-3 bg-base-200/50 border-b border-base-300">
              <div
                className="relative "
                tabIndex={-1}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node))
                    setIsProductDropdownOpen(false);
                }}
              >
                <Input
                  text="انتخاب محصول..."
                  icon={Search}
                  type="select"
                  className={cn(
                    "select-sm min-w-md",
                    selectedProductToAdd && "border-primary/50 bg-primary/5",
                  )}
                  onClick={() =>
                    setIsProductDropdownOpen(!isProductDropdownOpen)
                  }
                >
                  {selectedProductToAdd && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs btn-circle hover:bg-error/10 hover:text-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductId("");
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </Input>

                {isProductDropdownOpen && (
                  <div className="absolute z-999 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl max-h-60 h-60 overflow-y-auto">
                    <div className="p-2 border-b border-base-200 sticky top-0 bg-base-100 z-10">
                      <input
                        type="text"
                        className="input border-0 outline-0 input-xs w-full"
                        placeholder="جستجوی نام، برند یا SKU..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className=" menu p-1 w-full">
                      {availableProducts.length > 0 ? (
                        availableProducts.map((p) => (
                          <li key={p.id}>
                            <a
                              className="flex items-center gap-2 py-2"
                              onClick={() => {
                                setSelectedProductId(String(p.id));
                                setIsProductDropdownOpen(false);
                                setProductSearch("");
                              }}
                            >
                              <img
                                src={p.image}
                                className="rounded-full size-8"
                              />
                              <div className="flex-1 flex flex-col">
                                <span className="font-medium text-sm">
                                  {p.name}
                                </span>
                                <span className="text-[10px] text-base-content/60">
                                  {p.brand} | {p.sku}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-primary">
                                {parseInt(String(p.price)).toLocaleString(
                                  "fa-IR",
                                )}
                              </span>
                            </a>
                          </li>
                        ))
                      ) : (
                        <li className="text-center text-sm text-base-content/50 p-3">
                          محصولی یافت نشد
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="button"
                className={cn(
                  "btn btn-primary btn-sm gap-1 shrink-0",
                  !selectedProductToAdd && "btn-disabled opacity-50",
                )}
                onClick={handleAddItem}
                disabled={isSubmitting || !selectedProductToAdd}
              >
                <Plus size={16} />
                افزودن
              </button>
            </div>

            {/* Compact Table / List */}
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-base-content/40">
                <Package size={28} className="mb-2 opacity-50" />
                <p className="text-xs">محصولی به فاکتور اضافه نشده است</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr className="bg-base-200/30 text-base-content/70">
                      <th className="text-xs font-bold">محصول</th>
                      <th className="text-xs font-bold w-24 text-center">
                        تعداد
                      </th>
                      <th className="text-xs font-bold w-32 text-center">
                        قیمت واحد
                      </th>
                      <th className="text-xs font-bold w-32 text-center">
                        جمع کل
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => {
                      const selectedProduct = products?.find(
                        (p) => String(p.id) === item.productId,
                      );
                      return (
                        <tr key={idx} className="hover">
                          <td>
                            <div className="flex items-center gap-2">
                              {selectedProduct?.image && (
                                <img
                                  src={selectedProduct.image}
                                  className="w-8 h-8 rounded object-cover"
                                />
                              )}
                              <div>
                                <div className="font-bold text-xs">
                                  {item.productName}
                                </div>
                                <div
                                  className="text-[10px] opacity-50 font-mono"
                                  dir="ltr"
                                >
                                  SKU: {selectedProduct?.sku}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <input
                              type="number"
                              min="1"
                              max={selectedProduct?.stock || 9999}
                              className="input input-bordered input-xs w-16 text-center"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItemQuantity(idx, e.target.value)
                              }
                              disabled={isSubmitting}
                            />
                          </td>
                          <td className="text-center text-xs">
                            {parseInt(item.unitPrice).toLocaleString("fa-IR")}
                          </td>
                          <td className="text-center font-bold text-sm text-primary">
                            {item.total.toLocaleString("fa-IR")}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10"
                              onClick={() => removeItem(idx)}
                              disabled={isSubmitting}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Inline Totals */}
            {items.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-base-200/40 border-t border-base-300">
                <div className="flex gap-4 text-[11px] text-base-content/70">
                  <span>جمع: {subtotal.toLocaleString("fa-IR")} تومان</span>
                  {totalDiscount > 0 && (
                    <span className="text-success">
                      تخفیف: -{totalDiscount.toLocaleString("fa-IR")} تومان
                    </span>
                  )}
                  <span>
                    مالیات ({toPersianNum(taxRate.toString())}٪):{" "}
                    {tax.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">مبلغ نهایی:</span>
                  <span className="font-bold text-lg text-primary">
                    {grandTotal.toLocaleString("fa-IR")}
                    <span className="text-[10px] font-normal mr-1">تومان</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="shrink-0">
            <Input
              type="textarea"
              text="یادداشت یا توضیحات"
              className="textarea-sm"
              error={errors.note?.message}
            >
              <textarea
                className=" w-full resize-none text-sm"
                {...register("note", {
                  maxLength: { value: 500, message: "حداکثر ۵۰۰ کاراکتر" },
                })}
                disabled={isSubmitting}
              />
            </Input>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-base-300 bg-base-200/40 shrink-0">
          <p className="text-[10px] text-base-content/50">
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
              className={cn(
                "btn btn-primary btn-sm gap-2 min-w-28",
                isSubmitting && "loading",
              )}
              disabled={isSubmitting || !items?.length}
            >
              {!isSubmitting && <Check size={16} />}
              {isSubmitting ? "در حال ثبت..." : "ثبت فاکتور"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
