import { useNavigate } from "react-router";
import { formatCurrency, formatNumber } from "../../../Utils/AppUtils";
import type { Product } from "../../../Features/Product/CustomerTypes/ProductType";
import { DollarSign, Eye, History, Package, Trash2 } from "lucide-react";
import { useState } from "react";
import ProductAdjustStockModal from "./ProductAdjustStockModal";
import ProductChangePriceModal from "./ProductChangePriceModal";
import ProductDeleteModal from "./ProductDeleteModal";
import ProductOrderHistoryModal from "./ProductOrderHistoryModal";
import ImageModal from "../../../Components/Modals/ImageModal";

const getStatusBadge = (status: string): { cls: string; label: string } => {
  switch (status) {
    case "active":
      return { cls: "badge-success", label: "فعال" };
    case "inactive":
      return { cls: "badge-error", label: "ناموجود" };
    case "draft":
      return { cls: "badge-warning", label: "پیش‌نویس" };

    default:
      return { cls: "", label: "" };
  }
};

const getStockLevel = (
  stock: number,
  minStock: number,
): { cls: string; label: string } => {
  if (stock === 0) return { cls: "text-error font-bold", label: "ناموجود" };
  if (stock <= minStock)
    return { cls: "text-warning font-semibold", label: "کمبود" };
  return { cls: "text-success", label: "موجود" };
};

const getProfitMargin = (price: number, cost: number): number => {
  if (price === 0) return 0;
  return Math.round(((price - cost) / price) * 100);
};

interface Props {
  products: Product[];
}

export default function ProductsTableView({ products }: Props) {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openModal, setOpenModal] = useState<
    "stock" | "price" | "delete" | "order" | "image" | null
  >(null);

  const handleCloseModal = () => {
    setOpenModal(null);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 200);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr className="bg-base-300/75 text-xs">
              <th className="rounded-none">محصول</th>
              <th>دسته‌بندی</th>
              <th>قیمت</th>
              <th>حاشیه سود</th>
              <th>موجودی</th>
              <th>فروش</th>
              <th>وضعیت</th>
              <th className="rounded-none"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const badge = getStatusBadge(product.status);
              const stock = getStockLevel(product.stock, product.minStock);
              const margin = getProfitMargin(product.price, product.costPrice);

              return (
                <tr key={product.id} className=" ">
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        className="rounded-full w-10 h-10 "
                        src={product.image}
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpenModal("image");
                        }}
                      />

                      <div>
                        <p className="font-medium  max-w-[250px] truncate">
                          {product.name}
                        </p>

                        <p
                          className="text-xs text-base-content/50 font-mono"
                          dir="ltr"
                        >
                          {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-ghost badge-sm">
                      {product.category}
                    </span>
                  </td>

                  <td className=" text-sm text-primary whitespace-nowrap">
                    {formatCurrency(product.price)}
                  </td>

                  <td>
                    <span
                      className={`text-sm font-medium ${
                        margin >= 25
                          ? "text-success"
                          : margin >= 15
                            ? "text-warning"
                            : "text-error"
                      }`}
                    >
                      {margin}٪
                    </span>
                  </td>

                  <td>
                    <div className="flex flex-col items-start text-sm">
                      <span className={` ${stock.cls}`}>
                        {formatNumber(product.stock)}
                      </span>
                      <span className="text-[10px] text-base-content/40">
                        حداقل: {formatNumber(product.minStock)}
                      </span>
                    </div>
                  </td>

                  <td className="text-sm font-medium">
                    {formatNumber(product.sold)}
                  </td>
                  <td>
                    <span className={`badge badge-sm ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-xs btn-circle"
                      popoverTarget={`popover-product-${product.id}`}
                      style={
                        {
                          anchorName: `--anchor-product-${product.id}`,
                        } as React.CSSProperties
                      }
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    <ul
                      className="dropdown menu dropdown-start p-2 shadow-2xl bg-base-100 rounded-box min-w-40 border border-base-100 text-xs"
                      popover="auto"
                      id={`popover-product-${product.id}`}
                      style={
                        {
                          positionAnchor: `--anchor-product-${product.id}`,
                        } as React.CSSProperties
                      }
                    >
                      <li>
                        <a onClick={() => navigate(`/Products/${product.id}`)}>
                          <Eye size={18} />
                          مشاهده جزئیات
                        </a>
                      </li>

                      <li>
                        <a
                          onClick={() => {
                            setSelectedProduct(product);
                            setOpenModal("order");
                          }}
                        >
                          <History size={18} />
                          تاریخچه فروش
                        </a>
                      </li>

                      <li>
                        <a
                          onClick={() => {
                            setSelectedProduct(product);
                            setOpenModal("stock");
                          }}
                        >
                          <Package size={18} />
                          تنظیم موجودی
                        </a>
                      </li>

                      <li>
                        <a
                          onClick={() => {
                            setSelectedProduct(product);
                            setOpenModal("price");
                          }}
                        >
                          <DollarSign size={18} />
                          تغییر قیمت
                        </a>
                      </li>

                      <li>
                        <a
                          className="text-error"
                          onClick={() => {
                            setSelectedProduct(product);
                            setOpenModal("delete");
                          }}
                        >
                          <Trash2 size={18} />
                          حذف محصول
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {selectedProduct && (
          <>
            {openModal === "image" && (
              <ImageModal
                isOpen={openModal === "image"}
                onClose={handleCloseModal}
                src={selectedProduct.image}
                alt={selectedProduct.name}
                title={selectedProduct.name}
              />
            )}

            {openModal === "order" && (
              <ProductOrderHistoryModal
                isOpen={openModal === "order"}
                onClose={handleCloseModal}
                product={selectedProduct}
              />
            )}

            {openModal === "stock" && (
              <ProductAdjustStockModal
                isOpen={openModal === "stock"}
                onClose={handleCloseModal}
                product={selectedProduct}
              />
            )}

            {openModal === "price" && (
              <ProductChangePriceModal
                isOpen={openModal === "price"}
                onClose={handleCloseModal}
                product={selectedProduct}
              />
            )}

            {openModal === "delete" && (
              <ProductDeleteModal
                isOpen={openModal === "delete"}
                onClose={handleCloseModal}
                product={selectedProduct}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
