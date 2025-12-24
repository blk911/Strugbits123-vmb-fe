import React, { useEffect, useState } from "react";
import {
  FiEye,
  FiCheck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import defaultUser from "../../../../assets/user_icon.png";
import AppButton from "../../../common/site/AppButton";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import {
  useApproveSalonMutation,
  useGetPendingSalonsQuery,
  useRejectSalonMutation,
} from "../../../../store/api";
import { toastError, toastSuccess } from "../../../../utils/toast";
import { HiHandRaised } from "react-icons/hi2";

export default function PendingRequestsSection() {
  const { openModal } = useDashboardModal();
  const [page, setPage] = useState(1);
  const limit = 10;

  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetPendingSalonsQuery(
    { page, limit, sort: "newest" },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    refetch();
  }, [refetch]);
  const [approveSalon] = useApproveSalonMutation();
  const [rejectSalon] = useRejectSalonMutation();

  const pendingSalons = response?.data?.items || [];
  const totalPages = response?.data?.pages || 1;
  const currentPage = response?.data?.page || page;

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setPage(newPage);
    }
  };

  const handleApprove = async (salonId, salonName) => {
    setApprovingId(salonId);
    try {
      await approveSalon(salonId).unwrap();
      toastSuccess(`"${salonName}" has been approved successfully!`);
      openModal("salonApprovedSuccess", {
        title: "Salon Verification Approved",
        subtitle:
          "The salon has been successfully verified and approved. The owner can now access their salon dashboard and manage services.",
      });
    } catch (err) {
      toastError(err?.data?.message || "Failed to approve salon.");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (salonId, salonName) => {
    setRejectingId(salonId);
    try {
      await rejectSalon(salonId).unwrap();
      toastSuccess(`"${salonName}" has been rejected successfully!`);
      openModal("rejectionSent");
    } catch (err) {
      toastError(err?.data?.message || "Failed to reject salon.");
    } finally {
      setRejectingId(null);
    }
  };

  const isApprovingThis = (id) => approvingId === id;
  const isRejectingThis = (id) => rejectingId === id;
  const isProcessingThis = (id) => isApprovingThis(id) || isRejectingThis(id);

  if (isLoading && page === 1) {
    return (
      <div className="border border-[#E5E7EB] rounded-[12px] bg-white p-6 font-[Poppins]">
        <h2 className="text-[20px] font-semibold text-[#581838]">
          Pending Salon Owner Requests
        </h2>
        <div className="mt-6 text-center text-gray-500">
          Loading requests...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border border-[#E5E7EB] rounded-[12px] bg-white p-6 font-[Poppins]">
        <h2 className="text-[20px] font-semibold text-[#581838]">
          Pending Salon Owner Requests
        </h2>
        <div className="mt-6 text-center text-red-500">
          Failed to load requests. Please try again.
        </div>
      </div>
    );
  }

  if (pendingSalons.length === 0) {
    return (
      <div className="border border-[#E5E7EB] rounded-[12px] bg-white p-6 font-[Poppins]">
        <h2 className="text-[20px] font-semibold text-[#581838]">
          Pending Salon Owner Requests
        </h2>
        <div className="w-full h-[1px] bg-[#E5E7EB] my-4"></div>
        <p className="text-center text-gray-500 text-sm">
          No pending requests at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#E5E7EB] rounded-[12px] bg-white p-6 font-[Poppins] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-semibold text-[#581838]">
          Pending Salon Owner Requests
        </h2>
      </div>

      <div className="w-full h-[1px] bg-[#E5E7EB]"></div>

      {isFetching && page !== 1 && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-[12px]">
          <div className="text-gray-600">Loading page {page}...</div>
        </div>
      )}

      <div className="flex flex-col gap-4 relative">
        {pendingSalons.map((item) => (
          <div
            key={item._id}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between border border-[#E5E7EB] rounded-[8px] p-[17px] gap-4 hover:bg-[#FF92A533] transition cursor-pointer"
          >
            <div className="flex items-start gap-4 w-full">
              <img
                src={item.profilePic || item.image || defaultUser}
                alt={item.name}
                className="w-[48px] h-[48px] rounded object-cover"
              />
              <div className="flex flex-col gap-1">
                <p className="text-[16px] font-semibold text-[#581838]">
                  {item.name || "Unknown User"}
                </p>
                <p className="text-[14px] text-[#4B5563]">
                  {item.salonName} • {item.address || "Unknown City"}
                </p>
                <p className="text-[12px] text-[#6B7280]">
                  Applied {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
              <AppButton
                variant="custom"
                size="custom"
                className="flex-1 py-[8px] px-[13px] text-[14px] border border-[#581838] text-[#581838] hover:bg-[#581838]/10"
                leftIcon={<FiEye size={16} />}
                onClick={() => openModal("salonRequest", item)}
                disabled={isProcessingThis(item._id)}
              >
                View
              </AppButton>

              <AppButton
                variant="custom"
                size="custom"
                className="flex-1 py-[8px] px-[13px] text-[14px] border border-[#581838] text-[#581838] hover:bg-[#581838]/10"
                leftIcon={<FiCheck size={16} />}
                disabled={isProcessingThis(item._id)}
                onClick={() => handleApprove(item._id, item.salonName)}
              >
                {isApprovingThis(item._id) ? "Approving..." : "Approve"}
              </AppButton>
              <AppButton
                variant="custom"
                size="custom"
                className="flex-1 py-[8px] px-[13px] text-[14px] bg-[#FF92A5] text-white hover:opacity-90"
                leftIcon={<HiHandRaised size={16} />}
                disabled={isProcessingThis(item._id)}
                onClick={() =>
                  openModal("salonRejection", {
                    salonId: item._id,
                    salonName: item.salonName,
                  })
                }
              >
                Hold
              </AppButton>
              <AppButton
                variant="custom"
                size="custom"
                className="flex-1 py-[8px] px-[13px] text-[14px] bg-[#FF92A5] text-white hover:opacity-90"
                leftIcon={<FiX size={16} />}
                disabled={isProcessingThis(item._id)}
                onClick={() => handleReject(item._id, item.salonName)}
              >
                {isRejectingThis(item._id) ? "Rejecting..." : "Reject"}
              </AppButton>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col  sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-[#E5E7EB]">
        <div className="text-sm text-[#6B7280]">
          Page <b>{currentPage}</b> of <b>{totalPages}</b>
        </div>

        <div className="flex gap-2">
          <AppButton
            variant="custom"
            size="custom"
            className="px-4 py-2 text-sm border border-[#581838] text-[#581838] hover:bg-[#581838]/10 disabled:opacity-50"
            leftIcon={<FiChevronLeft size={16} />}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1 || isFetching}
          >
            Previous
          </AppButton>

          <AppButton
            variant="custom"
            size="custom"
            className="px-4 py-2 text-[10px] sm:text-sm border border-[#581838] text-[#581838] hover:bg-[#581838]/10 disabled:opacity-50 flex items-center gap-1 "
            rightIcon={<FiChevronRight size={16} />}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages || isFetching}
          >
            Next
          </AppButton>
        </div>
      </div>
    </div>
  );
}
