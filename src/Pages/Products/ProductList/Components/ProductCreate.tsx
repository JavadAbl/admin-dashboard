import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toPersianNum } from "../../../../Utils/AppUtils";
import { BRANDS } from "../../../../Features/Product/ProductEnums/BrandsEnum";
import { CATEGORIES } from "../../../../Features/Product/ProductEnums/CategoriesEnum";
import { toast } from "sonner";

// ============ Types ============
interface CreateProductForm {
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: string;
  costPrice: string;
  stock: string;
  minStock: string;
  status: "active" | "inactive" | "draft";
  description: string;
}

const INITIAL_FORM: CreateProductForm = {
  name: "",
  sku: "",
  category: "",
  brand: "",
  price: "",
  costPrice: "",
  stock: "",
  minStock: "",
  status: "active",
  description: "",
};

// ============ Helpers ============

const generateSku = (category: string): string => {
  const prefix: Record<string, string> = {
    "گوشی موبایل": "PHN",
    لپ‌تاپ: "LPT",
    تبلت: "TBT",
    "هدفون و هندزفری": "AUD",
    "ساعت هوشمند": "WCH",
    مانیتور: "MNT",
    دوربین: "CAM",
    اسپیکر: "SPK",
    "لوازم جانبی": "ACC",
    "کنسول بازی": "GME",
    ذخیره‌سازی: "STR",
    سایر: "OTH",
  };
  const p = prefix[category] || "GEN";
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${p}-${rand}`;
};

// ============ Image Dropzone ============
const ImageDropzone: React.FC<{
  disabled: boolean;
}> = ({ disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer min-h-[140px] ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-base-300 hover:border-primary/50 hover:bg-base-200/30"
      } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        // Handle file drop here
      }}
      onClick={() => {
        if (!disabled) {
          // Trigger file input here
        }
      }}
    >
      <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-base-content/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p className="text-sm text-base-content/60 font-medium">
        عکس محصول را بکشید اینجا رها کنید
      </p>
      <p className="text-xs text-base-content/40">
        یا کلیک کنید برای انتخاب فایل
      </p>
      <p className="text-[10px] text-base-content/30 mt-1">
        JPG, PNG, WebP — حداکثر ۵ مگابایت
      </p>
    </div>
  );
};

// ============ Main Component ============
const CreateProductModal: React.FC<{
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
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductForm>({
    defaultValues: INITIAL_FORM,
    mode: "onTouched",
  });

  const watchedCategory = watch("category");
  const watchedPrice = watch("price");
  const watchedCost = watch("costPrice");
  const watchedStock = watch("stock");
  const watchedMinStock = watch("minStock");
  const watchedDescription = watch("description", "");

  // Auto-generate SKU when category changes
  useEffect(() => {
    if (watchedCategory) {
      const currentSku = watch("sku");
      // Only auto-fill if SKU is empty or was previously auto-generated
      if (
        !currentSku ||
        currentSku.startsWith(generateSku(watchedCategory).split("-")[0] + "-")
      ) {
        setValue("sku", generateSku(watchedCategory), {
          shouldValidate: false,
        });
      }
    }
  }, [watchedCategory, setValue, watch]);

  // Live profit margin calculation
  const priceNum = parseFloat(watchedPrice) || 0;
  const costNum = parseFloat(watchedCost) || 0;
  const margin =
    priceNum > 0 ? Math.round(((priceNum - costNum) / priceNum) * 100) : 0;
  const profitAmount = priceNum - costNum;

  // Open / Close
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    if (isOpen && !modal.open) {
      reset(INITIAL_FORM);
      modal.showModal();
      setTimeout(() => setFocus("name"), 100);
    } else if (!isOpen && modal.open) {
      modal.close();
    }
  }, [isOpen, reset, setFocus]);

  const handleClose = useCallback(() => {
    reset(INITIAL_FORM);
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      handleClose();
    };
    modal.addEventListener("cancel", handleCancel);
    return () => modal.removeEventListener("cancel", handleCancel);
  }, [handleClose, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === modalRef.current) handleClose();
  };

  const onFormSubmit = async (data: CreateProductForm) => {
    try {
      toast.success(`محصول «${data.name}» با موفقیت ایجاد شد`);
      handleClose();
    } catch {
      toast.error("خطا در ایجاد محصول. لطفاً دوباره تلاش کنید");
    }
  };

  return (
    <>
      <dialog
        ref={modalRef}
        className="modal modal-bottom sm:modal-middle"
        onClick={handleBackdropClick}
      >
        <div
          className="modal-box max-w-3xl p-0 max-h-[90vh] overflow-y-auto"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-200/30 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                📦
              </div>
              <div>
                <h3 className="font-bold text-lg">محصول جدید</h3>
                <p className="text-xs text-base-content/50">
                  اطلاعات کالا را وارد کنید
                </p>
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={handleClose}
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

          <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <div className="px-6 py-5 space-y-5">
              {/* Image Upload */}
              <ImageDropzone disabled={isSubmitting} />

              {/* Row 1: Name & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control w-full md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">
                      نام محصول <span className="text-error mr-1">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: گوشی موبایل سامسونگ Galaxy S24"
                    className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                    {...register("name", {
                      required: "نام محصول الزامی است",
                      minLength: {
                        value: 3,
                        message: "نام باید حداقل ۳ کاراکتر باشد",
                      },
                    })}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.name.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-1">
                      SKU <span className="text-error">*</span>
                      {watchedCategory && (
                        <span
                          className="badge badge-ghost badge-xs cursor-pointer"
                          onClick={() =>
                            setValue("sku", generateSku(watchedCategory))
                          }
                          title="تولید مجدد کد"
                        >
                          🔄
                        </span>
                      )}
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: PHN-A3B2"
                    dir="ltr"
                    className={`input input-bordered w-full text-left font-mono ${errors.sku ? "input-error" : ""}`}
                    {...register("sku", {
                      required: "کد SKU الزامی است",
                      pattern: {
                        value: /^[A-Z0-9-]{4,20}$/,
                        message:
                          "فقط حروف انگلیسی بزرگ، عدد و خط تیره (۴-۲۰ کاراکتر)",
                      },
                    })}
                    disabled={isSubmitting}
                  />
                  {errors.sku && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.sku.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Row 2: Category & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      دسته‌بندی <span className="text-error mr-1">*</span>
                    </span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${errors.category ? "select-error" : ""}`}
                    {...register("category", {
                      required: "لطفاً دسته‌بندی را انتخاب کنید",
                    })}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      انتخاب دسته‌بندی...
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.category.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      برند <span className="text-error mr-1">*</span>
                    </span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${errors.brand ? "select-error" : ""}`}
                    {...register("brand", {
                      required: "لطفاً برند را انتخاب کنید",
                    })}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      انتخاب برند...
                    </option>
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  {errors.brand && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.brand.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Row 3: Prices with Live Margin */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      قیمت فروش (تومان){" "}
                      <span className="text-error mr-1">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="مثال: ۶۸۵۰۰۰۰۰"
                    dir="ltr"
                    className={`input input-bordered w-full text-left ${errors.price ? "input-error" : ""}`}
                    {...register("price", {
                      required: "قیمت فروش الزامی است",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "فقط عدد وارد کنید",
                      },
                      validate: (val) => {
                        const num = parseFloat(val);
                        if (isNaN(num) || num <= 0)
                          return "قیمت باید بزرگتر از صفر باشد";
                        const cost = parseFloat(watchedCost) || 0;
                        if (cost > 0 && num <= cost)
                          return "قیمت فروش باید بیشتر از قیمت خرید باشد";
                        return true;
                      },
                    })}
                    disabled={isSubmitting}
                  />
                  {watchedPrice && !isNaN(parseFloat(watchedPrice)) && (
                    <label className="label">
                      <span className="label-text-alt text-base-content/40">
                        {toPersianNum(
                          new Intl.NumberFormat("en-US").format(
                            parseFloat(watchedPrice),
                          ),
                        )}{" "}
                        تومان
                      </span>
                    </label>
                  )}
                  {errors.price && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.price.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      قیمت خرید (تومان){" "}
                      <span className="text-error mr-1">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="مثال: ۵۸۰۰۰۰۰۰"
                    dir="ltr"
                    className={`input input-bordered w-full text-left ${errors.costPrice ? "input-error" : ""}`}
                    {...register("costPrice", {
                      required: "قیمت خرید الزامی است",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "فقط عدد وارد کنید",
                      },
                      validate: (val) => {
                        const num = parseFloat(val);
                        if (isNaN(num) || num < 0)
                          return "قیمت خرید نمی‌تواند منفی باشد";
                        return true;
                      },
                    })}
                    disabled={isSubmitting}
                  />
                  {watchedCost && !isNaN(parseFloat(watchedCost)) && (
                    <label className="label">
                      <span className="label-text-alt text-base-content/40">
                        {toPersianNum(
                          new Intl.NumberFormat("en-US").format(
                            parseFloat(watchedCost),
                          ),
                        )}{" "}
                        تومان
                      </span>
                    </label>
                  )}
                  {errors.costPrice && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.costPrice.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Live Margin Display */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">حاشیه سود</span>
                  </label>
                  <div
                    className={`input input-bordered w-full flex items-center justify-center gap-2 font-bold text-lg ${
                      priceNum === 0
                        ? "bg-base-200 text-base-content/30"
                        : margin >= 25
                          ? "bg-success/10 text-success input-success"
                          : margin >= 10
                            ? "bg-warning/10 text-warning"
                            : "bg-error/10 text-error input-error"
                    }`}
                  >
                    {priceNum > 0 ? (
                      <>
                        <span>{toPersianNum(margin.toString())}٪</span>
                        <span className="text-xs font-normal opacity-60">
                          |
                        </span>
                        <span className="text-sm font-medium">
                          {toPersianNum(
                            new Intl.NumberFormat("en-US").format(
                              Math.max(0, profitAmount),
                            ),
                          )}
                        </span>
                        <span className="text-xs font-normal opacity-60">
                          تومان سود
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-normal">
                        قیمت وارد نشده
                      </span>
                    )}
                  </div>
                  <label className="label">
                    <span className="label-text-alt text-base-content/30">
                      محاسبه خودکار
                    </span>
                  </label>
                </div>
              </div>

              {/* Row 4: Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      موجودی انبار <span className="text-error mr-1">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="مثال: ۵۰"
                    dir="ltr"
                    className={`input input-bordered w-full text-left ${errors.stock ? "input-error" : ""}`}
                    {...register("stock", {
                      required: "موجودی الزامی است",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "فقط عدد وارد کنید",
                      },
                      validate: (val) => {
                        const num = parseInt(val);
                        if (isNaN(num) || num < 0)
                          return "موجودی نمی‌تواند منفی باشد";
                        return true;
                      },
                    })}
                    disabled={isSubmitting}
                  />
                  {watchedStock &&
                    !isNaN(parseInt(watchedStock)) &&
                    parseInt(watchedStock) === 0 && (
                      <label className="label">
                        <span className="label-text-alt text-warning flex items-center gap-1">
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
                          محصول با موجودی صفر به عنوان «ناموجود» ثبت می‌شود
                        </span>
                      </label>
                    )}
                  {errors.stock && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.stock.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      حداقل موجودی (هشدار){" "}
                      <span className="text-error mr-1">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="مثال: ۵"
                    dir="ltr"
                    className={`input input-bordered w-full text-left ${errors.minStock ? "input-error" : ""}`}
                    {...register("minStock", {
                      required: "حداقل موجودی الزامی است",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "فقط عدد وارد کنید",
                      },
                      validate: (val) => {
                        const num = parseInt(val);
                        if (isNaN(num) || num < 0)
                          return "مقدار نمی‌تواند منفی باشد";
                        return true;
                      },
                    })}
                    disabled={isSubmitting}
                  />
                  {watchedMinStock &&
                    watchedStock &&
                    !isNaN(parseInt(watchedStock)) &&
                    !isNaN(parseInt(watchedMinStock)) &&
                    parseInt(watchedStock) > 0 &&
                    parseInt(watchedStock) <= parseInt(watchedMinStock) && (
                      <label className="label">
                        <span className="label-text-alt text-warning flex items-center gap-1">
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
                          موجودی فعلی کمتر یا مساوی حد هشدار است
                        </span>
                      </label>
                    )}
                  {errors.minStock && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.minStock.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Row 5: Status & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">وضعیت</span>
                  </label>
                  <div className="flex gap-3 mt-1">
                    {[
                      {
                        key: "active" as const,
                        label: "فعال",
                        badge: "badge-success",
                      },
                      {
                        key: "inactive" as const,
                        label: "ناموجود",
                        badge: "badge-error",
                      },
                      {
                        key: "draft" as const,
                        label: "پیش‌نویس",
                        badge: "badge-warning",
                      },
                    ].map((s) => (
                      <label
                        key={s.key}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                          watch("status") === s.key
                            ? "border-primary bg-primary/5"
                            : "border-base-300 hover:border-base-content/20"
                        } ${isSubmitting ? "pointer-events-none opacity-60" : ""}`}
                      >
                        <input
                          type="radio"
                          className="radio radio-primary radio-sm"
                          value={s.key}
                          {...register("status")}
                          disabled={isSubmitting}
                        />
                        <span className={`badge badge-sm ${s.badge}`}>
                          {s.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description placeholder */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">توضیحات</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-[76px] resize-none"
                    placeholder="توضیحات مختصر درباره محصول (اختیاری)"
                    {...register("description", {
                      maxLength: {
                        value: 500,
                        message: "حداکثر ۵۰۰ کاراکتر",
                      },
                    })}
                    disabled={isSubmitting}
                  />
                  <label className="label justify-start gap-2">
                    <span className="label-text-alt text-base-content/40">
                      {toPersianNum(watchedDescription.length.toString())} / ۵۰۰
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-200/30 sticky bottom-0">
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
                  className={`btn btn-primary btn-sm gap-2 min-w-[120px] ${
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
                  {isSubmitting ? "در حال ایجاد..." : "ایجاد محصول"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </>
  );
};

export default CreateProductModal;
