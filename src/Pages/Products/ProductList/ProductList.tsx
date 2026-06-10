import { formatNumber } from "../../../Utils/AppUtils";
import { useGetProducts } from "../../../Features/Product/ProductApi";
import LoadingSpinner from "../../../Components/Utils/LoadingSpinner";
import { useState } from "react";
import { AlignJustify, Grid3X3, Search } from "lucide-react";
import ProductCreate from "../Components/ProductCreate";
import ProductsTableView from "../Components/ProductsTableView";
import ProductsGridView from "../Components/ProductsGridView";

export default function ProductList() {
  const [modalsKey, setModalsKey] = useState(0);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "draft"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<
    "all" | "inStock" | "lowStock" | "outOfStock"
  >("all");
  const [sortField, setSortField] = useState<
    "sold" | "price" | "stock" | "createdAt"
  >("sold");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const { data: products, isLoading: isLoadingProducts } = useGetProducts();

  if (isLoadingProducts) return <LoadingSpinner />;
  if (!products) return null;

  // Unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  // Filtered & sorted
  const filteredProducts = products
    .filter((p) => {
      const matchSearch =
        p.name.includes(searchQuery) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.includes(searchQuery);
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      const matchStock =
        stockFilter === "all" ||
        (stockFilter === "inStock" && p.stock > p.minStock) ||
        (stockFilter === "lowStock" && p.stock > 0 && p.stock <= p.minStock) ||
        (stockFilter === "outOfStock" && p.stock === 0);
      return matchSearch && matchStatus && matchCategory && matchStock;
    })
    .sort((a, b) => {
      if (sortField === "sold") return b.sold - a.sold;
      if (sortField === "price") return b.price - a.price;
      if (sortField === "stock") return a.stock - b.stock;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleOpenCreate = () => {
    setIsOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setIsOpenCreate(false);
    setModalsKey((val) => val + 1);
  };

  return (
    <>
      <div className="card bg-base-100 shadow-sm overflow-hidden h-full">
        <div className="card-body p-4 overflow-y-auto">
          {/* Toolbar */}
          <div className="border-b border-base-200 pb-4">
            <div className="flex flex-col gap-4">
              {/* Search - Full Width */}
              <div className="flex justify-between items-center">
                <div className="flex items-center form-control lg:w-[50%] xl:w-[35%] input input-bordered ">
                  <Search className=" w-4 h-4 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="جستجو بر اساس نام، SKU یا برند..."
                    className="input-sm "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleOpenCreate}
                >
                  {" + افزودن محصول"}
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* Status Filter */}
                <div className="join">
                  {(
                    [
                      { key: "all", label: "همه" },
                      { key: "active", label: "فعال" },
                      { key: "inactive", label: "ناموجود" },
                      { key: "draft", label: "پیش‌نویس" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.key}
                      className={`join-item btn btn-sm ${
                        statusFilter === f.key ? "btn-primary" : ""
                      }`}
                      onClick={() => setStatusFilter(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Category & Stock Filters Group */}
                <div className="flex items-center gap-2">
                  <select
                    className="select select-bordered select-sm"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">همه دسته‌ها</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <select
                    className="select select-bordered select-sm"
                    value={stockFilter}
                    onChange={(e) =>
                      setStockFilter(
                        e.target.value as
                          | "all"
                          | "inStock"
                          | "lowStock"
                          | "outOfStock",
                      )
                    }
                  >
                    <option value="all">همه موجودی</option>
                    <option value="inStock">موجود</option>
                    <option value="lowStock">کمبود</option>
                    <option value="outOfStock">ناموجود</option>
                  </select>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-6 bg-base-200" />

                {/* Sort & View Toggle Group */}
                <div className="flex items-center gap-2">
                  <select
                    className="select select-bordered select-sm"
                    value={sortField}
                    onChange={(e) =>
                      setSortField(
                        e.target.value as
                          | "sold"
                          | "price"
                          | "stock"
                          | "createdAt",
                      )
                    }
                  >
                    <option value="sold">مرتب: پرفروش‌ترین</option>
                    <option value="price">مرتب: گران‌ترین</option>
                    <option value="stock">مرتب: کمترین موجودی</option>
                    <option value="createdAt">مرتب: جدیدترین</option>
                  </select>

                  {/* View Toggle */}
                  <div className="join">
                    <button
                      className={`join-item btn btn-sm ${
                        viewMode === "table" ? "btn-primary" : ""
                      }`}
                      onClick={() => setViewMode("table")}
                    >
                      <AlignJustify className="w-4 h-4" />
                    </button>
                    <button
                      className={`join-item btn btn-sm ${
                        viewMode === "grid" ? "btn-primary" : ""
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-base-300" />

          {/* Table View */}
          {viewMode === "table" ? (
            <ProductsTableView products={filteredProducts} />
          ) : (
            /* Grid View */
            <ProductsGridView products={filteredProducts} />
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-base-content/40">
              <svg
                className="w-16 h-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="font-medium">محصولی یافت نشد</p>
              <p className="text-sm mt-1">فیلتر یا عبارت جستجو را تغییر دهید</p>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-base-200">
              <p className="text-xs text-base-content/50">
                نمایش ۱ تا {formatNumber(filteredProducts.length)} از{" "}
                {formatNumber(products.length)} محصول
              </p>
              <div className="join">
                <button className="join-item btn btn-sm btn-disabled">«</button>
                <button className="join-item btn btn-sm btn-primary">۱</button>
                <button className="join-item btn btn-sm">۲</button>
                <button className="join-item btn btn-sm">»</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductCreate
        key={`modal_${modalsKey}`}
        isOpen={isOpenCreate}
        onClose={handleCloseCreate}
      />
    </>
  );
}
