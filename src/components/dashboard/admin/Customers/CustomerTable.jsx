import React, { useState } from "react";
import {
  LuUserX,
  LuUserCheck,
  LuMail,
  LuArrowUp,
  LuArrowDown,
  LuArrowUpDown,
} from "react-icons/lu";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetAllCustomersQuery } from "../../../../store/api/adminApi";
import Pagination from "../../../common/dashboard/Table/Pagination";
import userPlaceholder from "../../../../assets/user.png";

const PAGE_SIZE = 10;

export default function CustomerTable({
  searchQuery = "",
  sortBy = "createdAt",
  sortOrder = -1,
  onSortChange,
  sort = "newest",
}) {
  const { openModal } = useDashboardModal();
  const [page, setPage] = useState(1);

  const {
    data: customerData,
    isLoading,
    isFetching,
  } = useGetAllCustomersQuery({
    page,
    limit: PAGE_SIZE,
    sortBy,
    sortOrder,
    sort,
    search: searchQuery,
  });

  const customers = customerData?.data?.items || [];
  const totalPages = customerData?.data?.pages || 1;

  const handleToggleSort = (field) => {
    if (onSortChange) {
      if (sortBy === field) {
        // Toggle direction if same field
        onSortChange(field, sortOrder === 1 ? -1 : 1);
      } else {
        // Switch to new field
        const defaultOrder = field === "createdAt" ? -1 : 1;
        onSortChange(field, defaultOrder);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm">
        <div className="text-vmb-text-muted animate-pulse">
          Loading customers...
        </div>
      </div>
    );
  }

  const HeaderItem = ({ label, field, sortable = true }) => {
    const isActive = sortBy === field;

    return (
      <div
        className="flex items-center gap-2 text-[#5C8374] font-semibold text-[14px] lg:text-[16px] cursor-pointer group select-none"
        onClick={sortable ? () => handleToggleSort(field) : undefined}
      >
        {label}
        {sortable && (
          <div className="flex items-center">
            {isActive ?
              sortOrder === 1 ?
                <LuArrowUp className="w-4 h-4 text-vmb-secondary" />
              : <LuArrowDown className="w-4 h-4 text-vmb-secondary" />
            : <LuArrowUpDown className="text-[#9CA3AF] w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
            }
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[15px] p-4 sm:p-6 shadow-sm border border-vmb-primary/5">
      {/* Table Header Row with #F8F8F8 background */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 mb-6 bg-[#F8F8F8] rounded-[10px]">
        <div className="col-span-3">
          <HeaderItem label="Customer Name" field="name" />
        </div>
        <div className="col-span-3">
          <HeaderItem label="Customer Email" field="email" />
        </div>
        <div className="col-span-3">
          <HeaderItem label="Customer Address" field="address" />
        </div>
        <div className="col-span-1">
          <HeaderItem label="Zip code" field="zipcode" />
        </div>
        <div className="col-span-2 text-right">
          <div className="flex items-center justify-end gap-2 text-[#5C8374] font-semibold text-[14px] lg:text-[16px]">
            Actions <LuArrowUpDown className="text-[#9CA3AF] w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Customer Rows - Cards with rounded borders */}
      <div className="flex flex-col gap-4">
        {customers.length === 0 ?
          <div className="bg-white p-12 text-center rounded-[10px] border-2 border-dashed border-vmb-primary/10">
            <p className="text-vmb-text-muted">No customers found.</p>
          </div>
        : customers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-[10px] p-3 sm:p-5 flex flex-col lg:grid lg:grid-cols-12 gap-4 items-center shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-[#E5E7EB] hover:border-[#5C8374]/30 transition-all font-poppins"
            >
              {/* Name & Avatar */}
              <div className="col-span-3 w-full flex items-center gap-4">
                <img
                  src={user.userProfile || userPlaceholder}
                  alt={user.name}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border border-vmb-primary/10 flex-shrink-0"
                />
                <span className="font-medium text-[#111827] text-[14px] lg:text-[16px]">
                  {user.name || "Unknown"}
                </span>
              </div>

              {/* Email */}
              <div className="col-span-3 w-full">
                <span className="lg:hidden text-xs text-vmb-text-muted block mb-1">
                  Email
                </span>
                <span className="text-[#4B5563] text-[14px] lg:text-[16px] break-all">
                  {user.email || "N/A"}
                </span>
              </div>

              {/* Address */}
              <div className="col-span-3 w-full">
                <span className="lg:hidden text-xs text-vmb-text-muted block mb-1">
                  Address
                </span>
                <span className="text-[#4B5563] text-[14px] lg:text-[16px] line-clamp-1">
                  {user.address || "N/A"}
                </span>
              </div>

              {/* Zip code */}
              <div className="col-span-1 w-full text-left">
                <span className="lg:hidden text-xs text-vmb-text-muted block mb-1">
                  Zip code
                </span>
                <span className="text-[#4B5563] text-[14px] lg:text-[16px]">
                  {user.zipcode || "N/A"}
                </span>
              </div>

              {/* Actions - Conditional Logic for clarity */}
              <div className="col-span-2 w-full flex justify-end gap-3 lg:pr-2">
                {!user.isSuspended ?
                  /* Active User: Show Suspend + Message */
                  <>
                    <button
                      onClick={() => openModal("suspendAdmin", user)}
                      className="w-10 h-10 flex items-center justify-center rounded-[8px] border border-[#E5E7EB] hover:bg-red-50 transition cursor-pointer group"
                      title="Suspend User"
                    >
                      <LuUserX className="w-5 h-5 text-[#9CA3AF] group-hover:text-red-500" />
                    </button>
                    <button
                      onClick={() => openModal("contactAdmin", user)}
                      className="w-10 h-10 flex items-center justify-center rounded-[8px] border border-[#E5E7EB] hover:bg-vmb-bg-soft transition cursor-pointer group"
                      title="Contact User"
                    >
                      <LuMail className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#5C8374]" />
                    </button>
                  </>
                : /* Suspended User: Show Unsuspend + Message */
                  <>
                    <button
                      onClick={() => openModal("unsuspendAdmin", user)}
                      className="w-10 h-10 flex items-center justify-center rounded-[8px] border border-[#E5E7EB] hover:bg-green-50 transition cursor-pointer group"
                      title="Unsuspend User"
                    >
                      <LuUserCheck className="w-5 h-5 text-[#9CA3AF] group-hover:text-green-600" />
                    </button>
                    <button
                      onClick={() => openModal("contactAdmin", user)}
                      className="w-10 h-10 flex items-center justify-center rounded-[8px] border border-[#E5E7EB] hover:bg-vmb-bg-soft transition cursor-pointer group"
                      title="Contact User"
                    >
                      <LuMail className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#5C8374]" />
                    </button>
                  </>
                }
              </div>
            </div>
          ))
        }
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="mt-8 pt-6 border-t border-vmb-primary/10">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isFetching={isFetching}
          />
        </div>
      )}
    </div>
  );
}
