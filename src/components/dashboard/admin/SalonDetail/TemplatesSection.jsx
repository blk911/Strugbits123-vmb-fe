import React, { useState } from "react";
import { useGetSalonAssignedTemplatesQuery } from "../../../../store/api/templateApi";
import TemplateCard from "../../admin/ServicePresets/TemplateCard";
import ChooseTemplateModal from "../../admin/Modals/ChooseTemplateModal";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

export default function TemplatesSection({ salonId }) {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const {
    data: templates,
    isLoading,
    refetch,
  } = useGetSalonAssignedTemplatesQuery(salonId);

  return (
    <div className="bg-white border border-vmb-primary/10 rounded-[12px] shadow-sm p-4 sm:p-5 md:p-6 w-full max-w-full relative">
      <div className="flex items-center font-poppins justify-between mb-6">
        <h3 className="text-vmb-primary text-[18px] font-semibold">
          Templates
        </h3>
        <button
          onClick={() => setIsManageModalOpen(true)}
          className="bg-vmb-secondary cursor-pointer hover:bg-vmb-secondary/90 text-white px-4 py-2 rounded-[8px] text-[16px]  transition-all"
        >
          Manage Template
        </button>
      </div>

      {isLoading ?
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      : !templates?.data || templates.data.length === 0 ?
        <div className="py-10 text-center border-2 border-dashed border-vmb-primary/5 rounded-xl">
          <p className="text-vmb-text-muted text-[15px]">
            Initially no template selected
          </p>
        </div>
      : <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {templates.data.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              isAdmin={true}
              onUpdate={refetch}
            />
          ))}
        </div>
      }

      {isManageModalOpen && (
        <ChooseTemplateModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          salonId={salonId}
          assignedTemplateIds={templates?.data?.map((t) => t._id) || []}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
