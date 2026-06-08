import React, { useState } from "react";
import CreateCustomerModal from "./CustomerCreateForm";

export default function CustomersHeader() {
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">مشتریان</h1>
          <p className="text-sm text-base-content/60 mt-1">
            مدیریت و بررسی اطلاعات مشتریان سیستم فروش
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm gap-2">
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            خروجی اکسل
          </button>

          <button
            className="btn btn-primary btn-sm gap-2"
            onClick={() => setIsOpenCreateModal(true)}
          >
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            افزودن مشتری
          </button>
        </div>
      </div>

      <CreateCustomerModal
        isOpen={isOpenCreateModal}
        onClose={() => setIsOpenCreateModal(false)}
      />
    </>
  );
}
