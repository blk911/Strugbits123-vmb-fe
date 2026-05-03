import React, { useState } from "react";
import {
  LuUserX,
  LuUserCheck,
  LuMail,
  LuArchive,
  LuArrowUp,
  LuArrowDown,
  LuArrowUpDown,
} from "react-icons/lu";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetAllCustomersQuery } from "../../../../store/api/adminApi";
import Pagination from "../../../common/dashboard/Table/Pagination";
import userPlaceholder from "../../../../assets/user.png";

const PAGE_SIZE = 10;

function getStatusBadge(user) {
  if (user.isSuspended) {
    return { label: "Suspended", className: "bg-red-100 text-red-700" };
  }
  if (user.status === "pending" || user.isActive === false) {
    return { label: "Pending", className: "bg-yellow-100 text-yellow-700" };
  }
  return { label: "Active", className: "bg-green-100 text-green-700" };
}

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
        onSortChange(field, sortOrder === 1 ? -1 : 1);
      } else {
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
        className="flex items-center gap-2 text-vmb-secondary font-semibold text-[14px] lg:text-[15px] cursor-pointer group select-none"
        onClick={sortable ? () => handleToggleSort(field) : undefined}
      >
        {label}
        {sortable && (
          <div className="flex items-center">
            {isActive ?
              sortOrder === 1 ?
                <LuArrowUp className="w-4 h-4 text-vmb-secondary" />
              : <LuArrowDown className="w-4 h-4 text-vmb-secondary" />
            : <LuArrowUpDown className="text-vmb-secondary w-4 h-4" />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[15px] p-4 sm:p-6 shadow-sm border border-vmb-primary/5">
      {/* Desktop header */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 mb-6 bg-vmb-table-header rounded-[10px]">
        <div className="col-span-2">
          <HeaderItem label="Customer Name" field="name" />
        </div>
        <div className="col-span-3">
          <HeaderItem label="Email" field="email" />
        </div>
        <div className="col-span-2">
          <HeaderItem label="Address" field="address" />
        </div>
        <div className="col-span-1">
          <HeaderItem label="Zip" field="zipcode" />
        </div>
        <div className="col-span-2">
          <div className="text-vmb-secondary font-semibold text-[14px] lg:text-[15px]">
            Status
          </div>
        </div>
        <div className="col-span-2 text-right">
          <div className="flex items-center justify-end gap-2 text-vmb-secondary font-semibold text-[14px] lg:text-[15px]">
            Actions
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {customers.length === 0 ?
          <div className="bg-white p-12 text-center rounded-[10px] border-2 border-dashed border-vmb-primary/10">
            <p className="text-vmb-text-muted">No customers found.</p>
          </div>
        : customers.map((user) => {
            const status = getStatusBadge(user);
            return (
              <div
                key={user._id}
                className="bg-white rounded-[10px] p-3 sm:p-4 flex flex-col lg:grid lg:grid-cols-12 gap-4 items-center shadow-[0px_2px_8px_rgba(0,0,0,0.04)] border border-vmb-border-gray hover:border-vmb-secondary/30 transition-all font-poppins"
              >
                {/* Name */}
                <div className="col-span-2 w-full flex items-center gap-3 font-poppins font-medium text-vmb-text-muted">
                  <img
                    src={user.userProfile || userPlaceholder}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-vmb-primary/10 flex-shrink-0"
                  />
                  <span className="font-medium text-vmb-text-muted text-[13px] line-clamp-1">
                    {user.name || "Unknown"}
                  </span>
                </div>

                {/* Email */}
                <div className="col-span-3 w-full">
                  <span className="lg:hidden text-xs text-vmb-text-muted block mb-1">Email</span>
                  <span className="text-[13px] break-all">{user.email || "N/A"}</span>
                </div>

                {/* Address */}
                <div className="col-span-2 w-full">
                  <span className="lg:hidden text-xs text-vmb-text-muted block mb-1">Address</span>
                  <span className="text-[13px] line-clamp-1">{user.address || "N/A"}</span>
                </div>

                {/* Zip */}
                <div className="col-span-1 w-full">
                  <span className="lg:hidden text-xs text-vmb-text-muted block mb-1">Zip</span>
                  <span className="text-[13px]">{user.zipcode || "N/A"}</span>
                </div>

                {/* Status badge */}
                <div className="col-span-2 w-full">
                  <span className="lg:hidden text-xs text-vmb-text-muted block mb-1">Status</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[12px] font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-2 w-full flex justify-end gap-2 lg:pr-1">
                  {!user.isSuspended ?
                    <button
                      onClick={() => openModal("suspendAdmin", user)}
                      className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[#E5E7EB] hover:bg-red-50 transition cursor-pointer group"
                      title="Suspend"
                    >
                      <LuUserX className="w-4 h-4 text-[#9CA3AF] group-hover:text-red-500" />
                    </button>
                  : <button
                      onClick={() => openModal("unsuspendAdmin", user)}
                      className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[#E5E7EB] hover:bg-green-50 transition cursor-pointer group"
                      title="Reinstate"
                    >
                      <LuUserCheck className="w-4 h-4 text-[#9CA3AF] group-hover:text-green-600" />
                    </button>
                  }
                  <button
                    onClick={() => openModal("contactAdmin", user)}
                    className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[#E5E7EB] hover:bg-vmb-bg-soft transition cursor-pointer group"
                    title="Contact"
                  >
                    <LuMail className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#5C8374]" />
                  </button>
                  <button
                    onClick={() => openModal("archiveCustomer", user)}
                    className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[#E5E7EB] hover:bg-orange-50 transition cursor-pointer group"
                    title="Archive"
                  >
                    <LuArchive className="w-4 h-4 text-[#9CA3AF] group-hover:text-orange-500" />
                  </button>
                </div>
              </div>
            );
          })
        }
      </div>

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
