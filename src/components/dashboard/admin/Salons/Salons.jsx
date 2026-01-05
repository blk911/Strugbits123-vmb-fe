import React, { useEffect, useState } from "react";
import Pagination from "../../../common/dashboard/Table/Pagination";
import { FiEye, FiCheck, FiX } from "react-icons/fi";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import {
  useApproveSalonMutation,
  useGetAllAdminSalonsQuery,
  useRejectSalonMutation,
} from "../../../../store/api";
import AdvancedTable from "./AdvancedTable";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../../../utils/toast";
const PAGE_SIZE = 10;

export default function AllSalons({ searchQuery = "", sortOption = "Newest" }) {
  const { openModal } = useDashboardModal();

  const [activeTab, setActiveTab] = useState("All");

  const [allPage, setAllPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [holdPage, setHoldPage] = useState(1);
  const [deactivatedPage, setDeactivatedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [processingId, setProcessingId] = useState(null);
  const sortMap = { Newest: "newest", Oldest: "oldest" };
  const sortValue = sortMap[sortOption] || "newest";
  const [approveSalon] = useApproveSalonMutation();
  const [rejectSalon] = useRejectSalonMutation();
  const {
    data: allData,
    isLoading: loadingAll,
    isFetching: fetchingAll,
    refetch: refetchAll,
  } = useGetAllAdminSalonsQuery({
    page: allPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
  });
  const {
    data: pendingData,
    isLoading: loadingPending,
    isFetching: fetchingPending,
    refetch: refetchPending,
  } = useGetAllAdminSalonsQuery({
    page: pendingPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "pending",
  });

  const {
    data: approvedData,
    isLoading: loadingApproved,
    isFetching: fetchingApproved,
    refetch: refetchApproved,
  } = useGetAllAdminSalonsQuery({
    page: approvedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "approved",
  });

  const {
    data: holdData,
    isLoading: loadingHold,
    isFetching: fetchingHold,
    refetch: refetchHold,
  } = useGetAllAdminSalonsQuery({
    page: holdPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "hold",
  });

  const {
    data: deactivatedData,
    isLoading: loadingDeactivated,
    isFetching: fetchingDeactivated,
    refetch: refetchDeactivated,
  } = useGetAllAdminSalonsQuery({
    page: deactivatedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "deactivated",
  });

  const {
    data: rejectedData,
    isLoading: loadingRejected,
    isFetching: fetchingRejected,
    refetch: refetchRejected,
  } = useGetAllAdminSalonsQuery({
    page: rejectedPage,
    limit: PAGE_SIZE,
    sort: sortValue,
    search: searchQuery,
    status: "rejected",
  });

  useEffect(() => {
    refetchAll();
    refetchPending();
    refetchApproved();
    refetchHold();
    refetchDeactivated();
    refetchRejected();
  }, [
    refetchAll,
    refetchPending,
    refetchApproved,
    refetchHold,
    refetchDeactivated,
    refetchRejected,
  ]);

  const currentData =
    activeTab === "All"
      ? allData
      : activeTab === "Pending"
      ? pendingData
      : activeTab === "Approved"
      ? approvedData
      : activeTab === "Hold"
      ? holdData
      : activeTab === "Deactivated"
      ? deactivatedData
      : rejectedData;

  const isLoading =
    activeTab === "All"
      ? loadingAll
      : activeTab === "Pending"
      ? loadingPending
      : activeTab === "Approved"
      ? loadingApproved
      : activeTab === "Hold"
      ? loadingHold
      : activeTab === "Deactivated"
      ? loadingDeactivated
      : loadingRejected;

  const isFetching =
    activeTab === "All"
      ? fetchingAll
      : activeTab === "Pending"
      ? fetchingPending
      : activeTab === "Approved"
      ? fetchingApproved
      : activeTab === "Hold"
      ? fetchingHold
      : activeTab === "Deactivated"
      ? fetchingDeactivated
      : fetchingRejected;

  const salons = currentData?.data?.items || [];
  const totalPages = currentData?.data?.pages || 1;

  const transformedData = salons.map((salon) => ({
    id: salon._id,
    image: salon.profilePic || "/default-salon.jpg",
    salonName: salon.salonName || "Unknown Salon",
    ownerName: salon.name || "N/A",
    email: salon.email || "N/A",
    phone: salon.phoneNumber || "N/A",
    ownerPhone: salon.ownerPhone || "N/A",
    submittedDate: salon.createdAt
      ? new Date(salon.createdAt).toLocaleDateString("en-GB")
      : "N/A",
    status: salon.status
      ? salon.status.charAt(0).toUpperCase() + salon.status.slice(1)
      : "Pending",
    address: salon.address || "N/A",
    timing: `${salon.startTime || "N/A"} - ${salon.endTime || "N/A"}`,
    workingDays: salon.workingDays?.join(", ") || "N/A",
    licenseDoc: salon.licenseDoc || "N/A",
    description: salon.description || "No description",
  }));

  const columns = [
    {
      key: "salonName",
      header: "Salon Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt={row.salonName}
            className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
          />
          <span className="font-medium text-gray-800">{row.salonName}</span>
        </div>
      ),
    },
    { key: "ownerName", header: "Owner Name" },
    { key: "email", header: "Email" },
    { key: "submittedDate", header: "Submitted" },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const styles = {
          Approved: "bg-[#4FCF0033] text-[#4FCF00]",
          Pending: "bg-[#FF950033] text-[#FF9500]",
          Hold: "bg-[#4B556333] text-[#4B5563]",
          Deactivated: "bg-[#4376C033] text-[#4376C0]",
          Rejected: "bg-[#DC262633] text-[#DC2626]",
        };
        return (
          <span
            className={`inline-block px-2 py-1.5 rounded-md text-[10px] font-medium ${
              styles[row.status] || "bg-gray-200 text-gray-600"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (row, onActionClick) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onActionClick?.("view", row);
            }}
            disabled={processingId === row.id}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-gray-50 transition cursor-pointer ${
              processingId === row.id ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="View"
          >
            <FiEye className="w-4 h-4 text-[#9CA3AFCC]" />
          </button>

          {row.status === "Pending" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick?.("approve", row);
                }}
                disabled={processingId === row.id}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-gray-50 transition cursor-pointer ${
                  processingId === row.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Approve"
              >
                <FiCheck className="w-4 text-[#9CA3AFCC]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick?.("reject", row);
                }}
                disabled={processingId === row.id}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-gray-50 transition cursor-pointer ${
                  processingId === row.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Reject"
              >
                <FiX className="w-4 h-4 text-[#9CA3AFCC]" />
              </button>
            </>
          )}

          {row.status === "Deactivated" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.("reactivate", row);
              }}
              disabled={processingId === row.id}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border border-[#9CA3AFCC] hover:bg-gray-50 transition cursor-pointer ${
                processingId === row.id ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Reactivate"
            >
              <FiCheck className="w-4 h-4 text-[#9CA3AFCC]" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleAction = async (action, row) => {
    if (action === "view") {
      const selectedRow = salons.find((salon) => salon._id === row.id);
      openModal("salonRequest", selectedRow);
    }

    if (action === "approve") {
      const selectedRow = salons.find((salon) => salon._id === row.id);
      const salonId = selectedRow._id;
      const salonName = selectedRow.salonName;
      setProcessingId(salonId);
      const loadingToast = toastLoading("Approving salon...");
      try {
        await approveSalon(salonId).unwrap();
        toastDismiss(loadingToast);
        // toastSuccess(`"${salonName}" has been approved successfully!`);
        openModal("salonApprovedSuccess", {
          title: "Salon Verification Approved",
          subtitle:
            "The salon has been successfully verified and approved. The owner can now access their salon dashboard and manage services.",
        });
      } catch (err) {
        toastDismiss(loadingToast);
        toastError(err?.data?.message || "Failed to approve salon.");
      } finally {
        setProcessingId(null);
      }
    }

    if (action === "reject") {
      const selectedRow = salons.find((salon) => salon._id === row.id);
      const salonId = selectedRow._id;
      const salonName = selectedRow.salonName;
      const loadingToast = toastLoading("Rejecting salon...");
      setProcessingId(salonId);
      try {
        await rejectSalon(salonId).unwrap();
        toastDismiss(loadingToast);
        toastSuccess(`"${salonName}" has been rejected successfully!`);
        openModal("rejectionSent");
      } catch (err) {
        toastDismiss(loadingToast);
        toastError(err?.data?.message || "Failed to reject salon.");
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleRowClick = (row) => {
    handleAction("view", row);
  };

  const handlePageChange = (page) => {
    if (activeTab === "All") setAllPage(page);
    else if (activeTab === "Pending") setPendingPage(page);
    else if (activeTab === "Approved") setApprovedPage(page);
    else if (activeTab === "Hold") setHoldPage(page);
    else if (activeTab === "Deactivated") setDeactivatedPage(page);
    else if (activeTab === "Rejected") setRejectedPage(page);
  };

  const currentPage =
    activeTab === "All"
      ? allPage
      : activeTab === "Pending"
      ? pendingPage
      : activeTab === "Approved"
      ? approvedPage
      : activeTab === "Hold"
      ? holdPage
      : activeTab === "Deactivated"
      ? deactivatedPage
      : rejectedPage;

  return (
    <div className="w-full flex flex-col gap-y-8 py-6 bg-[#EFEFEF]">
      <div className="bg-white rounded-[10px] shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-6 px-6 pt-6 border-b border-gray-200">
          {[
            "All",
            "Pending",
            "Approved",
            "Hold",
            // "Deactivated",
            "Rejected",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
            <div className="text-center py-12 text-gray-500">
              Loading salons...
            </div>
          ) : salons.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No salons found in this category
            </div>
          ) : (
            <>
              <AdvancedTable
                data={transformedData}
                columns={columns}
                onRowClick={handleRowClick}
                onActionClick={handleAction}
              />

              {totalPages > 1 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
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
