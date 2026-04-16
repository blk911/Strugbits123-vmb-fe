import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import {
  useGetTemplatesQuery,
  useAssignTemplatesMutation,
} from "../../../../store/api/templateApi";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import toast from "react-hot-toast";

export default function ChooseTemplateModal({
  isOpen,
  onClose,
  salonId,
  assignedTemplateIds = [],
  onSuccess,
}) {
  const [selectedIds, setSelectedIds] = useState(assignedTemplateIds);
  const { data: templatesData, isLoading } = useGetTemplatesQuery({
    limit: 100,
  });
  const [assignTemplates, { isLoading: isAssigning }] =
    useAssignTemplatesMutation();

  const templates = templatesData?.data?.items || [];

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    try {
      await assignTemplates({ salonId, templateIds: selectedIds }).unwrap();
      toast.success("Templates updated successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to assign templates");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[60] font-poppins"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="fixed inset-0 bg-vmb-overlay-bg" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
            >
              <Dialog.Panel className="w-full max-w-[447px] min-h-[480px] transform overflow-hidden rounded-[10px] backdrop-blur-[1px]  bg-vmb-modals-bg backdrop-blur-md p-[30px] flex flex-col gap-[32px] shadow-xl transition-all">
                {/* Header Row */}
                <div className="flex justify-between items-center w-full">
                  <Dialog.Title className="text-[24px] font-bold text-vmb-primary">
                    Choose Service Template
                  </Dialog.Title>
                  <IoClose
                    onClick={onClose}
                    className="text-vmb-primary text-[30px] cursor-pointer hover:opacity-70"
                  />
                </div>

                {/* List Container */}
                <div className="w-full max-w-[387px] h-[276px] bg-white border border-[#e5e5e5] rounded-[10px] p-[20px] flex flex-col gap-[10px] overflow-y-auto custom-scrollbar mx-auto">
                  {isLoading ?
                    <LoadingIndicator />
                  : templates.length === 0 ?
                    <p className="text-center py-10 text-vmb-text-muted">
                      No templates found
                    </p>
                  : templates.map((template) => (
                      <div
                        key={template._id}
                        onClick={() => toggleSelect(template._id)}
                        className="flex items-center gap-[12px] cursor-pointer group py-1"
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-[15px] h-[15px] rounded-[3px] border-2 border-vmb-secondary flex items-center justify-center transition-colors ${selectedIds.includes(template._id) ? "bg-white" : ""}`}
                        >
                          {selectedIds.includes(template._id) && (
                            <FaCheck className="text-vmb-secondary text-[10px]" />
                          )}
                        </div>

                        {/* Image */}
                        <img
                          src={template.serviceImage}
                          alt=""
                          className="w-[46px] h-[46px] rounded-[10px] object-cover"
                        />

                        {/* Info */}
                        <div className="flex flex-col gap-[2px]">
                          <p className="text-[#4b5563] text-[14px] font-semibold leading-tight line-clamp-1">
                            {template.serviceName}
                          </p>
                          <p className="text-vmb-secondary text-[12px] font-bold">
                            ${template.servicePrice}
                          </p>
                        </div>
                      </div>
                    ))
                  }
                </div>

                {/* Footer Action */}
                <button
                  onClick={handleSave}
                  disabled={isAssigning}
                  className="w-full max-w-[387px] h-[48px] bg-vmb-secondary text-white text-[16px] font-medium rounded-[10px] flex items-center justify-center hover:opacity-90 transition-all mx-auto active:scale-[0.98] disabled:opacity-50"
                >
                  {isAssigning ? "Saving..." : "Save These Template"}
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
