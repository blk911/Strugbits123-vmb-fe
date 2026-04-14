import React, { useState } from "react";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { 
  useUpdateTemplateMutation, 
  useDeleteTemplateMutation 
} from "../../../../store/api/templateApi";
import AddServiceModal from "../../saloon/Modals/AddServiceModal";
import DeleteConfirmModal from "../../saloon/Modals/DeleteConfirmModal";
import { 
  useCreateServiceMutation 
} from "../../../../store/api/salonApi";
import toast from "react-hot-toast";

export default function TemplateCard({ template, isAdmin, onUpdate }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  const [updateTemplate] = useUpdateTemplateMutation();
  const [deleteTemplate] = useDeleteTemplateMutation();
  const [createSalonService, { isLoading: isAdopting }] = useCreateServiceMutation();

  const handleUpdate = async (formData) => {
    try {
      await updateTemplate({ templateId: template._id, ...formData }).unwrap();
      setIsEditModalOpen(false);
      onUpdate?.();
      toast.success("Template updated successfully");
    } catch (error) {
      toast.error("Failed to update template");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTemplate(template._id).unwrap();
      setIsDeleteModalOpen(false);
      onUpdate?.();
      toast.success("Template deleted successfully");
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  const handleAddService = async (formData) => {
     try {
       await createSalonService(formData).unwrap();
       setIsAddServiceModalOpen(false);
       toast.success("Preset added to your services!");
     } catch (error) {
       toast.error(error?.data?.message || "Failed to adopt preset");
     }
  };

  return (
    <div className="bg-white border border-vmb-primary/10 rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-[200px] w-full overflow-hidden">
        <img
          src={template.serviceImage}
          alt={template.serviceName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2 py-1 rounded-[5px] font-medium">
          {template.serviceDuration} min
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-vmb-primary font-bold text-[18px] leading-tight line-clamp-1">
            {template.serviceName}
          </h3>
          <span className="text-vmb-primary font-bold text-[18px]">
            ${template.servicePrice}
          </span>
        </div>
        
        <p className="text-vmb-text-muted text-[13px] leading-[20px] line-clamp-2 h-[40px]">
          {template.description || "No description provided."}
        </p>

        {/* Action Buttons */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-grow h-[42px] border border-vmb-primary/10 rounded-[8px] flex items-center justify-center gap-2 text-vmb-primary text-[14px] font-medium hover:bg-vmb-bg-soft transition-colors"
              >
                <FiEdit3 className="text-lg" />
                Edit This Template
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-[42px] h-[42px] border border-vmb-primary/10 rounded-[8px] flex items-center justify-center text-vmb-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <FiTrash2 className="text-lg" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAddServiceModalOpen(true)}
              className="w-full h-[42px] border border-vmb-primary/10 rounded-[8px] flex items-center justify-center gap-2 text-vmb-primary text-[14px] font-medium hover:bg-vmb-bg-soft transition-colors"
            >
              <FiEdit3 className="text-lg" />
              Add to Services
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      {isAdmin && isEditModalOpen && (
        <AddServiceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdate}
          isTemplate={true}
          initialData={template}
          isEdit={true}
        />
      )}

      {isAdmin && isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Template"
          message={`Are you sure you want to delete "${template.serviceName}"? This action cannot be undone.`}
        />
      )}

      {!isAdmin && isAddServiceModalOpen && (
        <AddServiceModal
          isOpen={isAddServiceModalOpen}
          onClose={() => setIsAddServiceModalOpen(false)}
          onSubmit={handleAddService} // We'll finalize this adoption logic later
          initialData={template}
          adoptionMode={true}
        />
      )}
    </div>
  );
}
