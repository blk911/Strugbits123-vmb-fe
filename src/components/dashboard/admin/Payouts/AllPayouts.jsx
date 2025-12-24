import React, { useEffect, useState } from "react";
import Pagination from "../../../common/dashboard/Table/Pagination";
import {
  useGetAllPayoutsQuery,
  useMarkAsPaidMutation,
} from "../../../../store/api/payoutApi";
import AdvancedTable from "../Salons/AdvancedTable";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../../../utils/toast";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

const PAGE_SIZE = 10;

export default function AllPayouts({
  searchQuery = "",
  sortOption = "Newest",
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [processingId, setProcessingId] = useState(null);

  const sortMap = { Newest: "newest", Oldest: "oldest" };
  const sortValue = sortMap[sortOption] || "newest";

  const statusMap = {
    All: "",
    Pending: "pending",
    Paid: "paid",
  };

  const {
    data: payoutsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllPayoutsQuery({
    page,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: statusMap[activeTab],
  });

  const [markAsPaid] = useMarkAsPaidMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const payouts = payoutsData?.data?.items || [];
  const totalPages = payoutsData?.data?.pages || 1;

  const transformedData = payouts.map((payout) => ({
    id: payout._id,
    salonImage: payout.salon?.profilePic || "/default-salon.jpg",
    salonName: payout.salon?.salonName || "Unknown Salon",
    salonEmail: payout.salon?.email || "N/A",
    source:
      payout.sourceType.charAt(0).toUpperCase() + payout.sourceType.slice(1),
    services: payout.services,
    subtotal: payout.subtotal,
    vmbFee: payout.vmbFee,
    totalCharged: payout.totalCharged,
    payoutStatus: payout.payoutStatus,
    payoutDate: payout.payoutDate
      ? new Date(payout.payoutDate).toLocaleDateString("en-GB")
      : "N/A",
    customerName: payout.customerName,
  }));

  const columns = [
    {
      key: "salonName",
      header: "Salon",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.salonImage}
            alt={row.salonName}
            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
          />
          <div>
            <p className="font-medium text-gray-800 text-wrap break-all">
              {row.salonName}
            </p>
            <p className="text-xs text-gray-500 text-wrap break-all">
              {row.salonEmail}
            </p>
          </div>
        </div>
      ),
    },
    { key: "source", header: "Source" },
    {
      key: "services",
      header: "Services",
      render: (row) => (
        <div className="max-w-xs">
          {row.services.map((s, i) => (
            <div key={i} className="text-sm">
              {s.serviceName} - ${s.servicePrice}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "subtotal",
      header: "Subtotal",
      render: (row) => (
        <span className="font-medium">${row.subtotal.toFixed(2)}</span>
      ),
    },
    {
      key: "vmbFee",
      header: "VMB Fee",
      render: (row) => (
        <span className="font-medium">${row.vmbFee.toFixed(2)}</span>
      ),
    },
    {
      key: "totalCharged",
      header: "Total Charged",
      render: (row) => (
        <span className="font-bold text-lg text-[#FF92A5] ">
          ${row.totalCharged.toFixed(2)}
        </span>
      ),
    },
    {
      key: "payoutStatus",
      header: "Payout Status",
      render: (row) => {
        const isPaid = row.payoutStatus === "paid";
        return (
          <span
            className={`inline-block px-3 py-1.5 rounded-md text-xs font-medium ${
              isPaid
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {isPaid ? "Paid" : "Pending"}
          </span>
        );
      },
    },
    { key: "payoutDate", header: "Payout Date" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => {
        const isPending = row.payoutStatus === "pending";
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isPending) handleMarkAsPaid(row.id);
            }}
            disabled={!isPending || processingId === row.id}
            className={`px-4 py-2 rounded-lg text-[10px] sm:text-sm font-medium transition ${
              isPending
                ? "bg-[#FF92A5] hover:bg-[#FF92A5]/60 text-white cursor-pointer"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            } ${processingId === row.id ? "opacity-70" : ""}`}
          >
            {processingId === row.id
              ? "Processing..."
              : isPending
              ? "Mark as Paid"
              : "Paid"}
          </button>
        );
      },
    },
  ];

  const handleMarkAsPaid = async (earningId) => {
    setProcessingId(earningId);
    const loadingToast = toastLoading("Marking payout as paid...");
    try {
      await markAsPaid(earningId).unwrap();
      toastDismiss(loadingToast);
      toastSuccess("Payout marked as paid successfully!");
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to update payout status");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="w-full flex flex-col gap-y-8 py-6 bg-[#EFEFEF]">
      <div className="bg-white rounded-[10px] shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-6 px-6 pt-6 border-b border-gray-200">
          {["All", "Pending", "Paid"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
              className={`pb-3 cursor-pointer text-sm sm:text-lg font-semibold transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-[#FF92A5] border-[#FF92A5]"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <LoadingIndicator />
            </div>
          ) : payouts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No payouts found
            </div>
          ) : (
            <>
              <AdvancedTable data={transformedData} columns={columns} />

              {totalPages > 1 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isFetching={isFetching}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
