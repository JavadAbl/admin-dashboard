import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CITIES } from "../../../Features/App/AppEnums/CitiesEnum";
import { toast } from "sonner";

// ============ Types ============
interface CreateCustomerForm {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  status: "active" | "vip" | "inactive";
}

const INITIAL_FORM: CreateCustomerForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  notes: "",
  status: "active",
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ============ Main Component ============
export default function CustomerCreateModal({ isOpen, onClose }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerForm>({
    defaultValues: INITIAL_FORM,
    mode: "onSubmit", // Validate on first blur, then on change
  });

  // Watch address for character counter
  const addressValue = watch("address", "");

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

  const handleClose = () => {
    reset(INITIAL_FORM);
    onClose();
  };

  // Handle Escape key
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      handleClose();
    };
    modal.addEventListener("cancel", handleCancel);
    return () => modal.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === modalRef.current) {
      handleClose();
    }
  };

  // Submit handler
  const onFormSubmit = async (data: CreateCustomerForm) => {
    try {
      toast.success(`مشتری «${data.name}» با موفقیت ایجاد شد`);
      handleClose();
    } catch {
      toast.error("خطا در ایجاد مشتری. لطفاً دوباره تلاش کنید");
    }
  };

  return (
    <>
      <dialog
        ref={modalRef}
        className="modal modal-bottom sm:modal-middle "
        onClick={handleBackdropClick}
      >
        {/* 1. Added flex flex-col overflow-hidden to modal-box */}
        <div className="modal-box max-w-2xl p-0 flex flex-col overflow-hidden">
          {/* Header */}
          {/* 2. Added shrink-0 to prevent header from shrinking */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-base-200/30 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                ➕
              </div>
              <div>
                <h3 className="font-bold text-lg">مشتری جدید</h3>
                <p className="text-xs text-base-content/50">
                  اطلاعات مشتری را وارد کنید
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

          {/* Form */}
          {/* 3. Added flex flex-col flex-1 overflow-hidden to form */}
          <form
            className="flex flex-col flex-1 overflow-hidden"
            onSubmit={handleSubmit(onFormSubmit)}
            noValidate
          >
            {/* 4. Added flex-1 overflow-y-auto min-h-0 to the scrollable content area */}
            <div className="px-6 py-5 space-y-5 flex-1 overflow-y-auto min-h-0">
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      نام و نام خانوادگی{" "}
                      <span className="text-error mr-1">*</span>
                    </span>
                  </label>

                  <input
                    type="text"
                    placeholder="مثال: علی محمدی"
                    className={`input input-bordered w-full ${
                      errors.name ? "input-error" : ""
                    }`}
                    {...register("name", {
                      required: "نام و نام خانوادگی الزامی است",
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

                {/* Email */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      ایمیل <span className="text-error mr-1">*</span>
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="مثال: ali@example.com"
                    dir="ltr"
                    className={`input input-bordered w-full text-left ${
                      errors.email ? "input-error" : ""
                    }`}
                    {...register("email", {
                      required: "ایمیل الزامی است",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "فرمت ایمیل نامعتبر است",
                      },
                    })}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
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
                        {errors.email.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Row 2: Phone & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      شماره موبایل <span className="text-error mr-1">*</span>
                    </span>
                  </label>
                  <input
                    type="tel"
                    placeholder="مثال: 09121234567"
                    dir="ltr"
                    className={`input input-bordered w-full text-left ${
                      errors.phone ? "input-error" : ""
                    }`}
                    {...register("phone", {
                      required: "شماره تماس الزامی است",
                      pattern: {
                        value: /^09[0-9]{9}$/,
                        message: "شماره موبایل معتبر نیست (مثال: 09121234567)",
                      },
                    })}
                    disabled={isSubmitting}
                    maxLength={11}
                  />
                  {errors.phone && (
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
                        {errors.phone.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* City */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      شهر <span className="text-error mr-1">*</span>
                    </span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      errors.city ? "select-error" : ""
                    }`}
                    {...register("city", {
                      required: "لطفاً شهر را انتخاب کنید",
                    })}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      شهر را انتخاب کنید...
                    </option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
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
                        {errors.city.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Row 3: Address */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">آدرس</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-20 resize-none"
                  placeholder="آدرس کامل مشتری (اختیاری)"
                  {...register("address", {
                    maxLength: {
                      value: 300,
                      message: "آدرس نمی‌تواند بیشتر از ۳۰۰ کاراکتر باشد",
                    },
                  })}
                  disabled={isSubmitting}
                />
                <label className="label justify-start gap-2">
                  <span className="label-text-alt text-base-content/40">
                    {addressValue.length} / ۳۰۰
                  </span>
                </label>
              </div>

              {/* Row 4: Status & Notes */}
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
                        key: "vip" as const,
                        label: "VIP",
                        badge: "badge-warning",
                      },
                      {
                        key: "inactive" as const,
                        label: "غیرفعال",
                        badge: "badge-ghost",
                      },
                    ].map((s) => (
                      <label
                        key={s.key}
                        className={`flex items-center gap-2 px-1 py-2 rounded-lg border-2 cursor-pointer transition-all ${
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

                {/* Notes */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">یادداشت</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-[76px] resize-none"
                    placeholder="توضیحات اضافی (اختیاری)"
                    {...register("notes", {
                      maxLength: {
                        value: 200,
                        message: "یادداشت نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد",
                      },
                    })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            {/* 5. Added shrink-0 to prevent footer from shrinking */}
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
                  className={`btn btn-primary btn-sm gap-2 min-w-[120px] ${
                    isSubmitting ? "loading" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
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
                  {isSubmitting ? "در حال ایجاد..." : "ایجاد مشتری"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    </>
  );
}
