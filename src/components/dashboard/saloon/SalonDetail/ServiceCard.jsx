import { FaEdit, FaTrash } from "react-icons/fa";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import AppButton from "../../../common/site/AppButton";

export default function ServiceCard({ service }) {
  const { openModal } = useDashboardModal();

  const handleEditClick = () => {
    openModal("addService", service);
  };

  const handleDeleteClick = () => {
    openModal("delete", service?._id);
  };

  return (
    <div className="border border-[#58183880] rounded-[12px] p-4 sm:p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-300">
      <div className="relative w-full">
        <img
          src={service?.serviceImage}
          alt={service?.serviceName}
          className="w-full h-[180px] sm:h-[200px] md:h-[220px] object-cover rounded-md"
        />
        <div className="absolute top-3 right-3 bg-white text-[#6B7280] text-[12px] sm:text-[13px] px-3 py-[4px] rounded-[8px] shadow-sm">
          {service?.serviceDuration} min
        </div>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-2">
        <h4 className="text-[#581838] font-semibold text-[16px] sm:text-[18px] leading-[22px] sm:leading-[24px]">
          {service?.serviceName}
        </h4>
        <span className="text-[#6B7280] font-bold text-[16px] sm:text-[18px]">
          ${service?.servicePrice}
        </span>
      </div>

      <p className="text-[#4B5563] text-[14px] leading-[18px] sm:text-[15px]">
        {service?.description}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
        <AppButton
          leftIcon={
            <FaEdit className="text-[#FF92A5] text-[18px] flex-shrink-0" />
          }
          variant="outline-pink"
          size="custom"
          onClick={handleEditClick}
          className="flex-1 py-2 px-3 text-[15px] sm:text-[16px] font-medium"
        >
          Edit Service
        </AppButton>

        <button
          onClick={handleDeleteClick}
          className="w-full sm:w-[34px] h-[36px] rounded-[5px] bg-[#FF92A54D] flex items-center justify-center cursor-pointer gap-2"
        >
          <FaTrash className="text-[#581838] text-[16px]" />
          <span className="block sm:hidden text-[#581838] text-[16px]">
            Delete
          </span>
        </button>
      </div>
    </div>
  );
}
