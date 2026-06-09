import {
  Package,
  Tag,
  BarChart3,
  Warehouse,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Image as ImageIcon,
  Barcode,
  Layers,
  Building2,
  Calendar,
  DollarSign,
  ShoppingCart,
  ArrowLeft,
  Edit,
  Trash2,
  MoreVertical,
  QrCode,
  Copy,
  RefreshCw,
  Activity,
} from "lucide-react";
import type { Product } from "../../../Features/Product/CustomerTypes/ProductType";
import {
  formatCurrency,
  formatNumber,
  toPersianDate,
} from "../../../Utils/AppUtils";
import { useNavigate, useParams } from "react-router";
import { useGetProducts } from "../../../Features/Product/ProductApi";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  active: {
    label: "فعال",
    color: "badge-success",
    icon: <CheckCircle2 size={14} />,
  },
  inactive: {
    label: "غیرفعال",
    color: "badge-error",
    icon: <XCircle size={14} />,
  },
  low_stock: {
    label: "موجودی کم",
    color: "badge-warning",
    icon: <AlertTriangle size={14} />,
  },
  out_of_stock: {
    label: "ناموجود",
    color: "badge-error",
    icon: <XCircle size={14} />,
  },
};

function getStockStatus(product: Product) {
  if (product.stock === 0) return "out_of_stock";
  if (product.stock <= product.minStock) return "low_stock";
  return "active";
}

function getProfitMargin(price: number, costPrice: number) {
  if (costPrice === 0) return 0;
  return ((price - costPrice) / costPrice) * 100;
}

function getStockPercentage(stock: number, minStock: number) {
  const max = minStock * 5;
  return Math.min((stock / max) * 100, 100);
}

export default function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: products } = useGetProducts();

  if (!products) return null;
  const product = products.find((item) => item.id == id);
  console.log(product);

  if (!product) return null;

  const stockStatus = getStockStatus(product);
  const currentStatus = statusConfig[product.status] || statusConfig.active;
  const stockStatusInfo = statusConfig[stockStatus];
  const profitMargin = getProfitMargin(product.price, product.costPrice);
  const profit = product.price - product.costPrice;
  const stockPercent = getStockPercentage(product.stock, product.minStock);

  const stockBarColor =
    stockPercent > 60
      ? "progress-success"
      : stockPercent > 30
        ? "progress-warning"
        : "progress-error";

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-base-content">
                جزئیات محصول
              </h1>
              <p className="text-sm text-base-content/60">
                مشاهده و مدیریت اطلاعات محصول
              </p>
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
                  <a className="gap-2">
                    <QrCode size={16} />
                    بارکد محصول
                  </a>
                </li>
                <li>
                  <a className="gap-2">
                    <Copy size={16} />
                    کپی لینک
                  </a>
                </li>
                <li>
                  <a className="gap-2 text-error">
                    <Trash2 size={16} />
                    حذف محصول
                  </a>
                </li>
              </ul>
            </div>

            <button className="btn btn-ghost btn-circle btn-sm">
              <ArrowLeft size={20} onClick={() => navigate("/Products/List")} />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Right Column - Image & Quick Info */}
          <div className="flex flex-col gap-3 lg:col-span-1 h-full">
            {/* Product Image Card */}
            <div className="card bg-base-100 shadow-sm">
              <figure className="relative px-6 pt-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full rounded-xl object-cover aspect-square"
                />
                <div className="absolute top-8 left-8">
                  <span
                    className={`badge ${currentStatus.color} badge-lg gap-1 font-medium shadow-sm`}
                  >
                    {currentStatus.icon}
                    {currentStatus.label}
                  </span>
                </div>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title text-lg leading-relaxed">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 text-base-content/60">
                  <Barcode size={15} />
                  <span className="font-mono text-sm tracking-wider">
                    {product.sku}
                  </span>
                  <button
                    className="btn btn-ghost btn-xs btn-square"
                    onClick={() => navigator.clipboard?.writeText(product.sku)}
                    title="کپی SKU"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {/* Added: flex-1 so this card stretches to match the left column's height */}
            <div className="card bg-base-100 shadow-sm flex-1">
              <div className="card-body">
                <h3 className="mb-3 font-semibold text-base-content/80">
                  دسترسی سریع
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="btn btn-outline btn-sm gap-2">
                    <ShoppingCart size={15} />
                    سفارش جدید
                  </button>
                  <button className="btn btn-outline btn-sm gap-2">
                    <Package size={15} />
                    مدیریت موجودی
                  </button>
                  <button className="btn btn-outline btn-sm gap-2">
                    <BarChart3 size={15} />
                    گزارش فروش
                  </button>
                  <button className="btn btn-outline btn-sm gap-2">
                    <Edit size={15} />
                    ویرایش قیمت
                  </button>
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
                  <DollarSign size={16} className="text-success" />
                  <span className="text-xs">قیمت فروش</span>
                </div>
                <div className="text-lg font-bold text-success">
                  {formatCurrency(product.price)}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <Tag size={16} className="text-info" />
                  <span className="text-xs">قیمت خرید</span>
                </div>
                <div className="text-lg font-bold text-info">
                  {formatCurrency(product.costPrice)}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <Warehouse size={16} className="text-warning" />
                  <span className="text-xs">موجودی</span>
                </div>
                <div className="text-lg font-bold">
                  {formatNumber(product.stock)}{" "}
                  <span className="text-sm font-normal text-base-content/60">
                    عدد
                  </span>
                </div>
              </div>
              <div className="stat bg-base-100 rounded-box shadow-sm p-4">
                <div className="mb-1 flex items-center gap-2 text-base-content/60">
                  <ShoppingCart size={16} className="text-primary" />
                  <span className="text-xs">فروش کل</span>
                </div>
                <div className="text-lg font-bold text-primary">
                  {formatNumber(product.sold)}{" "}
                  <span className="text-sm font-normal text-base-content/60">
                    عدد
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                    <TrendingUp size={18} className="text-success" />
                  </div>
                  <h3 className="font-semibold">اطلاعات مالی</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-success/5 p-4 ring-1 ring-success/20">
                    <div className="mb-1 text-xs text-base-content/60">
                      سود هر واحد
                    </div>
                    <div className="text-xl font-bold text-success">
                      {formatCurrency(profit)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-info/5 p-4 ring-1 ring-info/20">
                    <div className="mb-1 text-xs text-base-content/60">
                      حاشیه سود
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-info">
                        {profitMargin.toFixed(1)}%
                      </span>
                      {profitMargin > 20 ? (
                        <TrendingUp size={16} className="text-success" />
                      ) : (
                        <TrendingDown size={16} className="text-error" />
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl bg-primary/5 p-4 ring-1 ring-primary/20">
                    <div className="mb-1 text-xs text-base-content/60">
                      ارزش کل موجودی
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {formatCurrency(product.stock * product.price)}
                    </div>
                  </div>
                </div>

                {/* Revenue estimate */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-base-200 p-4">
                  <div>
                    <div className="text-xs text-base-content/60">
                      درآمد کل فروش
                    </div>
                    <div className="text-lg font-bold">
                      {formatCurrency(product.sold * product.price)}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-base-content/60">
                      سود کل فروش
                    </div>
                    <div className="text-lg font-bold text-success">
                      {formatCurrency(product.sold * profit)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            {/* Added: flex-1 so this card stretches to match the right column's height */}
            <div className="card bg-base-100 shadow-sm flex-1">
              <div className="card-body">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                      <Warehouse size={18} className="text-warning" />
                    </div>
                    <h3 className="font-semibold">وضعیت موجودی</h3>
                  </div>
                  <span className={`badge ${stockStatusInfo.color} gap-1`}>
                    {stockStatusInfo.icon}
                    {stockStatusInfo.label}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Stock Bar */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-base-content/60">موجودی فعلی</span>
                      <span className="font-medium">
                        {formatNumber(product.stock)} از{" "}
                        {formatNumber(product.minStock * 5)}
                      </span>
                    </div>
                    <progress
                      className={`progress ${stockBarColor} h-3 w-full`}
                      value={stockPercent}
                      max="100"
                    ></progress>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="text-center rounded-lg bg-base-200 p-3">
                      <div className="text-xs text-base-content/60">
                        موجودی فعلی
                      </div>
                      <div className="mt-1 text-lg font-bold">
                        {formatNumber(product.stock)}
                      </div>
                    </div>
                    <div className="text-center rounded-lg bg-base-200 p-3">
                      <div className="text-xs text-base-content/60">
                        حداقل موجودی
                      </div>
                      <div className="mt-1 text-lg font-bold text-warning">
                        {formatNumber(product.minStock)}
                      </div>
                    </div>
                    <div className="text-center rounded-lg bg-base-200 p-3">
                      <div className="text-xs text-base-content/60">
                        تعداد فروخته شده
                      </div>
                      <div className="mt-1 text-lg font-bold text-primary">
                        {formatNumber(product.sold)}
                      </div>
                    </div>
                    <div className="text-center rounded-lg bg-base-200 p-3">
                      <div className="text-xs text-base-content/60">
                        نسبت فروش به موجودی
                      </div>
                      <div className="mt-1 text-lg font-bold text-info">
                        {product.stock > 0
                          ? (
                              (product.sold / (product.sold + product.stock)) *
                              100
                            ).toFixed(0)
                          : 100}
                        %
                      </div>
                    </div>
                  </div>

                  {stockStatus === "low_stock" && (
                    <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
                      <AlertTriangle
                        size={20}
                        className="shrink-0 text-warning"
                      />
                      <div>
                        <p className="font-medium text-warning">هشدار موجودی</p>
                        <p className="text-sm text-base-content/70">
                          موجودی این محصول از حداقل مجاز (
                          {formatNumber(product.minStock)} عدد) کمتر است. لطفاً
                          در اسرع وقت نسبت به تأمین مجدد اقدام کنید.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Product Details */}
          <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
                  <Package size={18} className="text-info" />
                </div>
                <h3 className="font-semibold">مشخصات محصول</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <tbody>
                    <tr>
                      <td className="w-48">
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Barcode size={15} />
                          کد SKU
                        </div>
                      </td>
                      <td className="font-mono font-medium">{product.sku}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Layers size={15} />
                          دسته‌بندی
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-ghost gap-1">
                          <Layers size={12} />
                          {product.category}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Building2 size={15} />
                          برند
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline gap-1">
                          <Building2 size={12} />
                          {product.brand}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <DollarSign size={15} />
                          قیمت فروش
                        </div>
                      </td>
                      <td className="font-medium text-success">
                        {formatCurrency(product.price)}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Tag size={15} />
                          قیمت خرید
                        </div>
                      </td>
                      <td className="font-medium text-info">
                        {formatCurrency(product.costPrice)}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <Activity size={15} />
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
                          تاریخ ایجاد
                        </div>
                      </td>
                      <td>{toPersianDate(product.createdAt)}</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/60">
                          <ImageIcon size={15} />
                          شناسه محصول
                        </div>
                      </td>
                      <td className="font-mono">#{product.id}</td>
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
                <li>
                  <div className="timeline-middle">
                    <CheckCircle2 size={16} className="text-success" />
                  </div>
                  <div className="timeline-end timeline-box border-none bg-base-200">
                    <div className="text-sm font-medium">فروش جدید</div>
                    <div className="text-xs text-base-content/60">
                      ۳ عدد از این محصول فروخته شد
                    </div>
                  </div>
                  <hr />
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <Package size={16} className="text-info" />
                  </div>
                  <div className="timeline-start timeline-box border-none bg-base-200">
                    <div className="text-sm font-medium">ورود موجودی</div>
                    <div className="text-xs text-base-content/60">
                      ۵۰ عدد به موجودی اضافه شد
                    </div>
                  </div>
                  <hr />
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <Edit size={16} className="text-warning" />
                  </div>
                  <div className="timeline-end timeline-box border-none bg-base-200">
                    <div className="text-sm font-medium">تغییر قیمت</div>
                    <div className="text-xs text-base-content/60">
                      قیمت از ۶۵,۰۰۰,۰۰۰ به ۶۸,۵۰۰,۰۰۰ تومان تغییر کرد
                    </div>
                  </div>
                  <hr />
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <CheckCircle2 size={16} className="text-primary" />
                  </div>
                  <div className="timeline-start timeline-box border-none bg-base-200">
                    <div className="text-sm font-medium">ایجاد محصول</div>
                    <div className="text-xs text-base-content/60">
                      محصول در سیستم ثبت شد
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
