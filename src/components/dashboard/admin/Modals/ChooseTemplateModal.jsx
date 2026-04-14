import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useGetTemplatesQuery, useAssignTemplatesMutation } from "../../../../store/api/templateApi";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import AppButton from "../../../common/site/AppButton";
import { FiSearch, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ChooseTemplateModal({ 
  isOpen, 
  onClose, 
  salonId, 
  assignedTemplateIds = [],
  onSuccess 
}) {
  const [selectedIds, setSelectedIds] = useState(assignedTemplateIds);
  const [search, setSearch] = useState("");
  const { data: templatesData, isLoading } = useGetTemplatesQuery({ limit: 100, search });
  const [assignTemplates, { isLoading: isAssigning }] = useAssignTemplatesMutation();

  const templates = templatesData?.data?.items || [];

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
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
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
            >
              <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-[20px] bg-white p-6 shadow-xl transition-all font-poppins">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-[22px] font-bold text-vmb-primary">
                    Manage Templates
                  </Dialog.Title>
                  <IoClose
                    onClick={onClose}
                    className="text-vmb-primary text-3xl cursor-pointer hover:opacity-70"
                  />
                </div>

                <div className="relative mb-6">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-vmb-text-muted/60" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-[45px] pl-10 pr-4 bg-vmb-bg-soft border border-vmb-primary/10 rounded-[10px] text-[14px] focus:outline-none focus:ring-1 focus:ring-vmb-secondary/50"
                  />
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 mb-6">
                  {isLoading ? (
                    <LoadingIndicator />
                  ) : templates.length === 0 ? (
                    <p className="text-center py-10 text-vmb-text-muted">No templates found</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {templates.map((template) => (
                        <div 
                          key={template._id}
                          onClick={() => toggleSelect(template._id)}
                          className={`p-4 rounded-[12px] border cursor-pointer transition-all flex items-center justify-between ${
                            selectedIds.includes(template._id) 
                              ? "border-vmb-secondary bg-vmb-secondary/5" 
                              : "border-vmb-primary/5 hover:border-vmb-primary/20"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                             <img 
                               src={template.serviceImage} 
                               className="w-12 h-12 rounded-lg object-cover" 
                               alt="" 
                             />
                             <div>
                               <p className="font-semibold text-vmb-primary text-[15px]">{template.serviceName}</p>
                               <p className="text-[13px] text-vmb-text-muted">${template.servicePrice}</p>
                             </div>
                          </div>
                          {selectedIds.includes(template._id) && (
                            <div className="w-6 h-6 rounded-full bg-vmb-secondary flex items-center justify-center text-white">
                               <FiCheck size={14} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 text-[16px] font-semibold text-vmb-primary border border-vmb-primary/10 rounded-xl hover:bg-vmb-bg-soft transition-colors"
                  >
                    Cancel
                  </button>
                  <AppButton
                    onClick={handleSave}
                    disabled={isAssigning}
                    className="flex-1 py-3 text-[16px] font-semibold"
                  >
                    {isAssigning ? "Saving..." : "Save Selection"}
                  </AppButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
