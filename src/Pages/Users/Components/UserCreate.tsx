import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserPlus, Check, Shield, Mail, Phone, UserIcon } from "lucide-react";
import type { UserRole } from "../../../Features/Auth/AuthTypes/UserType";
import Modal from "../../../Components/Modals/Modal";
import { cn } from "../../../Utils/Cn";
import Input from "../../../Components/Inputs/Input";

// ============ Types ============
interface CreateUserForm {
  name: string;
  username: string;
  email: string;
  mobile: string;
  role: UserRole;
}

const INITIAL_FORM: CreateUserForm = {
  name: "",
  username: "",
  email: "",
  mobile: "",
  role: "user",
};

const roleOptions: { value: UserRole; label: string; icon: React.ReactNode }[] =
  [
    {
      value: "admin",
      label: "مدیر سیستم",
      icon: <Shield size={14} className="text-error" />,
    },
    {
      value: "manager",
      label: "مدیر",
      icon: <Shield size={14} className="text-warning" />,
    },
    {
      value: "user",
      label: "کاربر",
      icon: <UserIcon size={14} className="text-info" />,
    },
    {
      value: "viewer",
      label: "ناظر",
      icon: <Shield size={14} className="text-base-content/50" />,
    },
  ];

// ============ Main Component ============
export default function UserCreate({
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
    formState: { errors, isSubmitting },
  } = useForm<CreateUserForm>({
    defaultValues: INITIAL_FORM,
    mode: "onSubmit",
  });

  const [selectedRole, setSelectedRole] = useState<UserRole>("user");

  useEffect(() => {
    (() => {
      if (isOpen) {
        reset(INITIAL_FORM);
        setSelectedRole("user");
      }
    })();
  }, [isOpen, reset]);

  const handleClose = useCallback(() => {
    reset(INITIAL_FORM);
    setSelectedRole("user");
    onClose();
  }, [onClose, reset]);

  const onFormSubmit = async (data: CreateUserForm) => {
    try {
      console.log({
        ...data,
        role: selectedRole,
        isActive: "active",
      });
      toast.success("کاربر با موفقیت ایجاد شد");
      handleClose();
    } catch {
      toast.error("خطا در ایجاد کاربر. لطفاً دوباره تلاش کنید");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="کاربر جدید"
      description="اطلاعات کاربر را وارد کنید"
      icon={UserPlus}
      className="max-w-xl  "
    >
      <form
        className="flex flex-col h-full overflow-hidden"
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
      >
        <div className="flex flex-col gap-4 px-6 py-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* Row 1: Name */}
          <Input
            type="input"
            text="نام کامل"
            className="input-sm"
            required
            error={errors.name?.message}
            icon={UserIcon}
          >
            <input
              type="text"
              placeholder="نام و نام خانوادگی"
              {...register("name", {
                required: "نام کامل الزامی است",
                minLength: {
                  value: 3,
                  message: "نام باید حداقل ۳ کاراکتر باشد",
                },
              })}
              disabled={isSubmitting}
            />
          </Input>

          {/* Row 2: Username */}
          <Input
            text="نام کاربری"
            type="input"
            className="input-sm"
            error={errors.username?.message}
            required
          >
            <input
              type="text"
              className={cn("font-mono")}
              placeholder="username"
              dir="ltr"
              {...register("username", {
                required: "نام کاربری الزامی است",
                minLength: {
                  value: 3,
                  message: "نام کاربری باید حداقل ۳ کاراکتر باشد",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد و زیرخط باشد",
                },
              })}
              disabled={isSubmitting}
            />
          </Input>

          {/* Row 3: Email */}
          <Input
            text="ایمیل"
            type="input"
            className="input-sm"
            icon={Mail}
            error={errors.email?.message}
            required
          >
            <div className="relative">
              <input
                type="email"
                placeholder="example@domain.com"
                dir="ltr"
                {...register("email", {
                  required: "ایمیل الزامی است",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "فرمت ایمیل نامعتبر است",
                  },
                })}
                disabled={isSubmitting}
              />
            </div>
          </Input>

          {/* Row 4: Mobile */}
          <Input
            text="موبایل"
            type="input"
            className="input-sm"
            icon={Phone}
            error={errors.mobile?.message}
            required
          >
            <input
              type="tel"
              placeholder="09123456789"
              dir="ltr"
              {...register("mobile", {
                required: "شماره موبایل الزامی است",
                pattern: {
                  value: /^09[0-9]{9}$/,
                  message: "فرمت شماره موبایل نامعتبر است (مثال: 09123456789)",
                },
              })}
              disabled={isSubmitting}
            />
          </Input>

          {/* Row 5: Role */}
          <div>
            <label className="label py-1">
              <span className="label-text text-xs font-bold">
                نقش <span className="text-error">*</span>
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "btn btn-sm gap-2 justify-start",
                    selectedRole === option.value
                      ? "btn-primary"
                      : "btn-outline",
                  )}
                  onClick={() => {
                    setSelectedRole(option.value);
                  }}
                  disabled={isSubmitting}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
            <input
              type="hidden"
              {...register("role", { required: true })}
              value={selectedRole}
            />
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
              disabled={isSubmitting}
            >
              {!isSubmitting && <Check size={16} />}
              {isSubmitting ? "در حال ثبت..." : "ثبت کاربر"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
