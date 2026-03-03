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
    <div className="border border-vmb-primary/50 rounded-[12px] p-4 sm:p-5 flex flex-col gap-4 h-full hover:shadow-md transition-all duration-300">
      <div className="relative w-full h-[200px] shrink-0">
        <img
          src={service?.serviceImage}
          alt={service?.serviceName}
          className="w-full h-full object-cover rounded-md"
        />
        <div
          className="absolute top-3 right-3 bg-white text-vmb-text-muted
                     text-[12px] px-3 py-[4px] rounded-[8px] shadow-sm"
        >
          {service?.serviceDuration} min
        </div>
      </div>

      <div className="flex justify-between items-start gap-2">
        <h4
          className="text-vmb-primary font-semibold text-[16px] sm:text-[18px]
                       leading-[22px] line-clamp-2 max-w-[70%]"
        >
          {service?.serviceName}
        </h4>

        <span className="text-vmb-text-muted font-bold text-[16px] sm:text-[18px]">
          ${service?.servicePrice}
        </span>
      </div>

      <p
        className="text-vmb-text-main text-[14px] sm:text-[15px]
                     leading-[18px] line-clamp-2 "
      >
        {service?.description || "\u00A0"}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
        <AppButton
          leftIcon={
            <FaEdit className="text-vmb-secondary text-[18px] flex-shrink-0" />
          }
          variant="outline-dark"
          size="custom"
          onClick={handleEditClick}
          className="flex-1 py-2 px-3 text-[15px] sm:text-[16px] font-medium"
        >
          {service?.salonId ? "Edit" : "Add"} Service
        </AppButton>
        {service?.salonId && (
          <button
            onClick={handleDeleteClick}
            className="w-full sm:w-[34px] h-[36px] rounded-[5px] bg-vmb-secondary/30 flex items-center justify-center cursor-pointer gap-2"
          >
            <FaTrash className="text-vmb-primary text-[16px]" />
            <span className="block sm:hidden text-vmb-primary text-[16px]">
              Delete
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
