import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import {
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} from "../../../../store/api/templateApi";
import AddServiceModal from "../../saloon/Modals/AddServiceModal";
import DeleteConfirmModal from "../../saloon/Modals/DeleteConfirmModal";
import { useCreateServiceMutation } from "../../../../store/api/salonApi";
import toast from "react-hot-toast";
import AppButton from "../../../common/site/AppButton";

export default function TemplateCard({ template, isAdmin, onUpdate }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  const [updateTemplate] = useUpdateTemplateMutation();
  const [deleteTemplate] = useDeleteTemplateMutation();
  const [createSalonService, { isLoading: isAdopting }] =
    useCreateServiceMutation();

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
    <>
      <div className="border border-vmb-primary/50 rounded-[12px] p-4 sm:p-5 flex flex-col gap-4 h-full hover:shadow-md transition-all duration-300 bg-white">
        {/* Image Section */}
        <div className="relative w-full h-[200px] shrink-0">
          <img
            src={template.serviceImage}
            alt={template.serviceName}
            className="w-full h-full object-cover rounded-md"
          />
          <div className="absolute top-3 right-3 bg-white text-vmb-text-muted text-[12px] px-3 py-[4px] rounded-[8px] shadow-sm">
            {template.serviceDuration} min
          </div>
        </div>

        {/* Content Section */}
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-vmb-primary font-semibold text-[16px] sm:text-[18px] leading-[22px] line-clamp-2 max-w-[70%]">
            {template.serviceName}
          </h4>
          <span className="text-vmb-text-muted font-bold text-[16px] sm:text-[18px]">
            ${template.servicePrice}
          </span>
        </div>

        <p className="text-vmb-text-main text-[14px] sm:text-[15px] leading-[18px] line-clamp-2 flex-grow">
          {template.description || "\u00A0"}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          {isAdmin ?
            <>
              <AppButton
                leftIcon={
                  <FaEdit className="text-vmb-secondary text-[18px] flex-shrink-0" />
                }
                variant="outline-dark"
                size="custom"
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 py-2 px-3 text-[15px] sm:text-[16px] font-medium"
              >
                Edit Template
              </AppButton>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full sm:w-[34px] h-[36px] rounded-[5px] bg-vmb-secondary/30 flex items-center justify-center cursor-pointer gap-2"
              >
                <FiTrash2 className="text-vmb-primary text-[16px]" />
                <span className="block sm:hidden text-vmb-primary text-[16px]">
                  Delete
                </span>
              </button>
            </>
          : <AppButton
              leftIcon={
                <FaEdit className="text-vmb-secondary text-[18px] flex-shrink-0" />
              }
              variant="outline-dark"
              size="custom"
              onClick={() => setIsAddServiceModalOpen(true)}
              className="flex-1 py-2 px-3 text-[15px] sm:text-[16px] font-medium"
            >
              Add Service
            </AppButton>
          }
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
          onSubmit={handleAddService}
          initialData={template}
          adoptionMode={true}
        />
      )}
    </>
  );
}
