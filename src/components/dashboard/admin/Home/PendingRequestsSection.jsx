import React from "react";
import { FiEye, FiCheck, FiX } from "react-icons/fi";
import defaultUser from "../../../../assets/user_icon.png";
import AppButton from "../../../common/site/AppButton";
import { useDashboardModal } from "../../../../pages/ModalProvider";

export default function PendingRequestsSection() {
  const { openModal } = useDashboardModal();
  const requests = [
    {
      name: "Sarah Chen",
      salon: "Luxe Beauty Lounge • Los Angeles",
      applied: "Applied 1 day ago",
      image: defaultUser,
    },
    {
      name: "Emily Rodriguez",
      salon: "Glow Studio • San Diego",
      applied: "Applied 2 days ago",
      image: defaultUser,
    },
    {
      name: "Mia Patel",
      salon: "Beauty Haven • San Francisco",
      applied: "Applied 3 days ago",
      image: defaultUser,
    },
  ];

  return (
    <div className="border border-[#E5E7EB] rounded-[12px] bg-white p-6 flex flex-col gap-4 font-[Poppins] ">
      <h2 className="text-[20px] font-semibold text-[#581838]">
        Pending Salon Owner Requests
      </h2>

      <div className="w-full h-[1px] bg-[#E5E7EB]"></div>

      <div className="flex flex-col gap-4">
        {requests.map((item, index) => (
          <div
            key={index}
            className="
              flex flex-col md:flex-row 
              items-start md:items-center 
              justify-between 
              border border-[#E5E7EB] rounded-[8px] 
              p-[17px] gap-4 hover:bg-[#FF92A533] 
              transition cursor-pointer
            "
          >
            <div className="flex items-start gap-4 w-full">
              <img
                src={item.image}
                alt={item.name}
                className="w-[48px] h-[48px] rounded object-cover"
              />

              <div className="flex flex-col gap-1">
                <p className="text-[16px] font-semibold text-[#581838]">
                  {item.name}
                </p>
                <p className="text-[14px] text-[#4B5563]">{item.salon}</p>
                <p className="text-[12px] text-[#6B7280]">{item.applied}</p>
              </div>
            </div>

            <div
              className="
                flex 
                flex-wrap sm:flex-nowrap 
                md:flex-row 
                w-full md:w-auto 
                gap-3
              "
            >
              <AppButton
                variant="custom"
                size="custom"
                className="flex-1 sm:flex py-[8px] px-[13px] text-[14px] border border-[#581838] text-[#581838] hover:bg-[#581838]/10"
                leftIcon={<FiEye size={16} />}
                onClick={() => openModal("salonRequest")}
              >
                View
              </AppButton>

              <AppButton
                variant="custom"
                size="custom"
                className="flex-1 sm:flex py-[8px] px-[13px] text-[14px] border border-[#581838] text-[#581838] hover:bg-[#581838]/10"
                leftIcon={<FiCheck size={16} />}
                onClick={() =>
                  openModal("salonApprovedSuccess", {
                    title: "Salon Verification Approved",
                    subtitle:
                      "The salon has been successfully verified and approved. The owner can now access their salon dashboard and manage services.",
                  })
                }
              >
                Approve
              </AppButton>

              <AppButton
                variant="custom"
                size="custom"
                className="flex-1 sm:flex py-[8px] px-[13px] text-[14px] bg-[#FF92A5] text-white hover:opacity-90"
                leftIcon={<FiX size={16} />}
                onClick={() => openModal("salonRejection")}
              >
                Reject
              </AppButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
