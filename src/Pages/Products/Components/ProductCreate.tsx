import React, { useRef, useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toPersianNum } from "../../../Utils/AppUtils";
import { BRANDS } from "../../../Features/Product/ProductEnums/BrandsEnum";
import { CATEGORIES } from "../../../Features/Product/ProductEnums/CategoriesEnum";
import { toast } from "sonner";
import Input from "../../../Components/Inputs/Input";
import ImageDropzone from "../../../Components/Inputs/ImageDropzone";

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

// ============ Main Component ============
const ProductCreate: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductForm>({
    defaultValues: INITIAL_FORM,
    mode: "onSubmit",
  });

  const watchedPrice = watch("price");
  const watchedCost = watch("costPrice");
  const watchedStock = watch("stock");
  const watchedMinStock = watch("minStock");
  const watchedDescription = watch("description", "");

  // Open / Close
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    if (isOpen && !modal.open) {
      reset(INITIAL_FORM);
      modal.showModal();
    } else if (!isOpen && modal.open) {
      modal.close();
    }
  }, [isOpen, reset]);

  const handleClose = useCallback(() => {
    reset(INITIAL_FORM);
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const handleCancel = (e: Event) => {
      if (fileDialogOpen) {
        e.preventDefault(); // block Esc and backdrop‑triggered close
        return;
      }
      handleClose();
    };
    modal.addEventListener("cancel", handleCancel);
    return () => modal.removeEventListener("cancel", handleCancel);
  }, [handleClose, fileDialogOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === modalRef.current) handleClose();
  };

  const onFormSubmit = async (data: CreateProductForm) => {
    try {
      console.log(data);
      console.log(images);

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
        <div className="modal-box max-w-fit lg:max-w-250 p-0 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-200/30 sticky top-0 z-10 shrink-0">
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
              {/* Row 1: Name & SKU */}
              <div className="flex gap-4">
                <Input
                  type="input"
                  text="نام محصول"
                  error={errors.name?.message}
                  required
                >
                  <input
                    type="text"
                    placeholder="مثال: گوشی موبایل سامسونگ Galaxy S24"
                    className={`w-full`}
                    {...register("name", {
                      required: "نام محصول الزامی است",
                      minLength: {
                        value: 3,
                        message: "نام باید حداقل ۳ کاراکتر باشد",
                      },
                    })}
                    disabled={isSubmitting}
                  />
                </Input>

                <Input
                  type="input"
                  text="SKU"
                  error={errors.sku?.message}
                  required
                >
                  <input
                    type="text"
                    placeholder="مثال: PHN-A3B2"
                    dir="ltr"
                    className={`w-full text-left font-mono`}
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
                </Input>
              </div>

              {/* Row 2: Category & Brand */}
              <div className="flex gap-4">
                <Input
                  type="select"
                  text="دسته‌بندی"
                  error={errors.category?.message}
                  required
                >
                  <select
                    className={`w-full`}
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
                </Input>

                <Input
                  type="select"
                  text="برند"
                  error={errors.brand?.message}
                  required
                >
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
                </Input>
              </div>

              {/* Row 3: Prices with Live Margin */}
              <div className="flex gap-4">
                <Input
                  type="input"
                  text="قیمت فروش"
                  error={errors.price?.message}
                  required
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="مثال: ۶۸۵۰۰۰۰۰"
                    dir="ltr"
                    className={`w-full text-left`}
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
                </Input>

                <Input
                  type="input"
                  text="قیمت خرید"
                  error={errors.costPrice?.message}
                  required
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="مثال: ۵۸۰۰۰۰۰۰"
                    dir="ltr"
                    className={`w-full text-left`}
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
                </Input>

                {/* Live Margin Display */}
              </div>

              {/* Row 4: Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="input"
                  text=" موجودی انبار"
                  error={errors.stock?.message}
                  required
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="مثال: ۵۰"
                    dir="ltr"
                    className={`w-full text-left`}
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
                </Input>

                <Input
                  type="input"
                  text=" حداقل موجودی"
                  error={errors.minStock?.message}
                  required
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="مثال: ۵"
                    dir="ltr"
                    className={`w-full text-left`}
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
                </Input>
              </div>

              {/* Row 5: Status & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Description placeholder */}
                <Input
                  type="textarea"
                  text="توضیحات"
                  error={errors.description?.message}
                >
                  <textarea
                    className="w-full h-[84px] resize-none"
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
                </Input>

                {/* Image Upload */}
                <ImageDropzone
                  disabled={isSubmitting}
                  onFilesSelected={(files) => setImages(files)}
                  onDialogToggle={setFileDialogOpen}
                />

                {/* Status */}
                <div className="w-full">
                  <label className="label">
                    <span className="label-text font-medium">وضعیت</span>
                  </label>
                  <div className="flex flex-wrap gap-3 mt-1">
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
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-200/30 shrink-0 ">
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
                  {isSubmitting ? "در حال ایجاد..." : "ایجاد محصول"}
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

export default ProductCreate;
