import {
  UserIcon,
  Mail,
  Phone,
  Shield,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MoreVertical,
  Copy,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Activity,
  Clock,
  Hash,
  AtSign,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import type { UserRole } from "../../../Features/Auth/AuthTypes/UserType";
import { useGetUsers } from "../../../Features/Auth/AuthApi";
import { toPersianDate } from "../../../Utils/AppUtils";

const roleConfig: Record<
  UserRole,
  { label: string; color: string; icon: React.ReactNode }
> = {
  admin: {
    label: "مدیر سیستم",
    color: "badge-error",
    icon: <Shield size={14} />,
  },
  manager: {
    label: "مدیر",
    color: "badge-warning",
    icon: <Shield size={14} />,
  },
  user: {
    label: "کاربر",
    color: "badge-info",
    icon: <UserIcon size={14} />,
  },
  viewer: {
    label: "ناظر",
    color: "badge-ghost",
    icon: <Activity size={14} />,
  },
};

const statusConfig: Record<
  "active" | "inactive",
  { label: string; color: string; icon: React.ReactNode }
> = {
  active: {
    label: "فعال",
    color: "badge-success",
    icon: <CheckCircle2 size={14} />,
  },
  inactive: {
    label: "غیرفعال",
    color: "badge-ghost",
    icon: <XCircle size={14} />,
  },
};

export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: users } = useGetUsers();

  const user = users?.find((item) => item.id === id);

  if (!users || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-base-content/40">
        <UserIcon size={48} className="mb-4" />
        <p className="font-medium">کاربر یافت نشد</p>
        <button
          className="btn btn-ghost btn-sm mt-4"
          onClick={() => navigate("/Users")}
        >
          <ArrowLeft size={16} />
          بازگشت به لیست
        </button>
      </div>
    );
  }

  const currentRole = roleConfig[user.role];
  const currentStatus = statusConfig[user.isActive];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-base-content">
                جزئیات کاربر
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-sm gap-2">
              <RefreshCw size={16} />
              بروزرسانی
            </button>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm btn-square"
              >
                <MoreVertical size={16} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg"
              >
                <li>
                  <a
                    className="gap-2"
                    onClick={() =>
                      navigator.clipboard?.writeText(user.username)
                    }
                  >
                    <Copy size={16} />
                    کپی نام کاربری
                  </a>
                </li>
                {user.isActive === "active" ? (
                  <li>
                    <a className="gap-2 text-error">
                      <ToggleLeft size={16} />
                      غیرفعال‌سازی
                    </a>
                  </li>
                ) : (
                  <li>
                    <a className="gap-2 text-success">
                      <ToggleRight size={16} />
                      فعال‌سازی
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <button className="btn btn-ghost btn-circle btn-sm">
              <ArrowLeft size={20} onClick={() => navigate("/Users")} />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Right Column - Quick Info */}
          <div className="flex flex-col gap-3 lg:col-span-1 h-full">
            {/* User Info Card */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UserIcon size={24} className="text-primary" />
                  </div>
                  <span
                    className={`badge ${currentStatus.color} badge-lg gap-1 font-medium shadow-sm`}
                  >
                    {currentStatus.icon}
                    {currentStatus.label}
                  </span>
                </div>

                <h2 className="card-title text-lg leading-relaxed">
                  {user.name}
                </h2>

                <p className="text-sm text-base-content/60 font-mono" dir="ltr">
                  @{user.username}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-sm flex-1">
              <div className="card-body">
                <h3 className="mb-3 font-semibold text-base-content/80">
                  دسترسی سریع
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn btn-outline btn-sm gap-2">
                    <Mail size={15} />
                    ایمیل
                  </button>
                  <button className="btn btn-outline btn-sm gap-2">
                    <Phone size={15} />
                    تماس
                  </button>
                  <button className="btn btn-outline btn-sm gap-2">
                    <Copy size={15} />
                    کپی لینک
                  </button>
                  {user.isActive === "active" ? (
                    <button className="btn btn-outline btn-sm gap-2 text-error">
                      <ToggleLeft size={15} />
                      غیرفعال
                    </button>
                  ) : (
                    <button className="btn btn-outline btn-sm gap-2 text-success">
                      <ToggleRight size={15} />
                      فعال
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Left Column - Details */}
          <div className="flex flex-col gap-3 lg:col-span-2 h-full">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <AtSign size={16} className="text-primary" />
                  <span className="text-xs">نام کاربری</span>
                </div>
                <div
                  className="text-lg font-bold text-primary font-mono"
                  dir="ltr"
                >
                  {user.username}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <Shield size={16} className="text-warning" />
                  <span className="text-xs">نقش</span>
                </div>
                <div className="text-lg font-bold text-warning">
                  {currentRole.label}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <Mail size={16} className="text-info" />
                  <span className="text-xs">ایمیل</span>
                </div>
                <div className="text-sm font-bold text-info truncate" dir="ltr">
                  {user.email}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <Phone size={16} className="text-success" />
                  <span className="text-xs">موبایل</span>
                </div>
                <div
                  className="text-sm font-bold text-success font-mono"
                  dir="ltr"
                >
                  {user.mobile}
                </div>
              </div>
            </div>

            {/* Inactive Warning */}
            {user.isActive === "inactive" && (
              <div className="flex items-center gap-3 rounded-xl border border-error/30 bg-error/5 p-4">
                <XCircle size={20} className="shrink-0 text-error" />
                <div>
                  <p className="font-medium text-error">حساب غیرفعال</p>
                  <p className="text-sm text-base-content/70">
                    این حساب کاربری در حال حاضر غیرفعال است و امکان دسترسی به
                    سیستم را ندارد.
                  </p>
                </div>
              </div>
            )}

            {/* Profile Summary */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                    <Activity size={18} className="text-success" />
                  </div>
                  <h3 className="font-semibold">خلاصه پروفایل</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-primary/5 p-4 ring-1 ring-primary/20">
                    <div className="mb-1 text-xs text-base-content/60">
                      نام کامل
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {user.name}
                    </div>
                  </div>
                  <div className="rounded-xl bg-success/5 p-4 ring-1 ring-success/20">
                    <div className="mb-1 text-xs text-base-content/60">
                      نقش سیستمی
                    </div>
                    <div className="text-lg font-bold text-success">
                      {currentRole.label}
                    </div>
                  </div>
                  <div className="rounded-xl bg-info/5 p-4 ring-1 ring-info/20">
                    <div className="mb-1 text-xs text-base-content/60">
                      وضعیت حساب
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${currentStatus.color} gap-1 mt-1`}
                      >
                        {currentStatus.icon}
                        {currentStatus.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-base-200 p-4">
                  <div>
                    <div className="text-xs text-base-content/60">
                      تاریخ عضویت
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {toPersianDate(user.createdAt)}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-base-content/60">
                      آخرین بروزرسانی
                    </div>
                    <div className="text-sm font-medium text-base-content/70">
                      {user.updatedAt ? toPersianDate(user.updatedAt) : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Table */}
            <div className="card bg-base-100 shadow-sm flex-1">
              <div className="card-body">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                    <Phone size={18} className="text-warning" />
                  </div>
                  <h3 className="font-semibold">اطلاعات تماس</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="table table-sm table-zebra w-full">
                    <thead>
                      <tr className="bg-base-300/75 text-xs">
                        <th className="rounded-none">نوع</th>
                        <th>مقدار</th>
                        <th className="rounded-none">وضعیت</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="flex items-center gap-2">
                            <Mail size={15} className="text-info" />
                            <span className="text-sm">ایمیل</span>
                          </div>
                        </td>
                        <td className="font-mono text-sm" dir="ltr">
                          {user.email}
                        </td>
                        <td>
                          <span className="badge badge-success badge-sm">
                            تأیید شده
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="flex items-center gap-2">
                            <Phone size={15} className="text-success" />
                            <span className="text-sm">موبایل</span>
                          </div>
                        </td>
                        <td className="font-mono text-sm" dir="ltr">
                          {user.mobile}
                        </td>
                        <td>
                          <span className="badge badge-success badge-sm">
                            تأیید شده
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Info Table & Timeline */}
        <div className="flex gap-3">
          {/* User Info Table */}
          <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
                  <UserIcon size={18} className="text-info" />
                </div>
                <h3 className="font-semibold">اطلاعات کاربر</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <tbody>
                    <tr>
                      <td className="w-48">
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Hash size={15} />
                          شناسه کاربر
                        </div>
                      </td>
                      <td className="font-mono font-medium">#{user.id}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <UserIcon size={15} />
                          نام کامل
                        </div>
                      </td>
                      <td className="font-medium">{user.name}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <AtSign size={15} />
                          نام کاربری
                        </div>
                      </td>
                      <td className="font-mono font-medium" dir="ltr">
                        @{user.username}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Mail size={15} />
                          ایمیل
                        </div>
                      </td>
                      <td className="font-mono" dir="ltr">
                        {user.email}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Phone size={15} />
                          موبایل
                        </div>
                      </td>
                      <td className="font-mono" dir="ltr">
                        {user.mobile}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Shield size={15} />
                          نقش
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${currentRole.color} gap-1`}>
                          {currentRole.icon}
                          {currentRole.label}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <CheckCircle2 size={15} />
                          وضعیت
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${currentStatus.color} gap-1`}>
                          {currentStatus.icon}
                          {currentStatus.label}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Calendar size={15} />
                          تاریخ عضویت
                        </div>
                      </td>
                      <td>{toPersianDate(user.createdAt)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Clock size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold">آخرین فعالیت‌ها</h3>
              </div>

              <ul className="timeline timeline-vertical timeline-compact">
                {user.isActive === "inactive" && (
                  <li>
                    <div className="timeline-middle">
                      <XCircle size={16} className="text-error" />
                    </div>
                    <div className="timeline-end timeline-box border-none bg-base-200">
                      <div className="text-sm font-medium">حساب غیرفعال شد</div>
                      <div className="text-xs text-base-content/60">
                        دسترسی این کاربر به سیستم قطع شد
                      </div>
                    </div>
                    <hr />
                  </li>
                )}

                {user.updatedAt && (
                  <li>
                    <hr />
                    <div className="timeline-middle">
                      <RefreshCw size={16} className="text-warning" />
                    </div>
                    <div className="timeline-start timeline-box border-none bg-base-200">
                      <div className="text-sm font-medium">
                        بروزرسانی پروفایل
                      </div>
                      <div className="text-xs text-base-content/60">
                        اطلاعات کاربر بروزرسانی شد —{" "}
                        {toPersianDate(user.updatedAt)}
                      </div>
                    </div>
                    <hr />
                  </li>
                )}

                <li>
                  <hr />
                  <div className="timeline-middle">
                    <CheckCircle2 size={16} className="text-success" />
                  </div>
                  <div className="timeline-end timeline-box border-none bg-base-200">
                    <div className="text-sm font-medium">تأیید ایمیل</div>
                    <div className="text-xs text-base-content/60">
                      آدرس ایمیل کاربر تأیید شد
                    </div>
                  </div>
                  <hr />
                </li>

                <li>
                  <hr />
                  <div className="timeline-middle">
                    <UserIcon size={16} className="text-info" />
                  </div>
                  <div className="timeline-start timeline-box border-none bg-base-200">
                    <div className="text-sm font-medium">ثبت‌نام</div>
                    <div className="text-xs text-base-content/60">
                      حساب کاربری «{user.name}» ایجاد شد —{" "}
                      {toPersianDate(user.createdAt)}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
