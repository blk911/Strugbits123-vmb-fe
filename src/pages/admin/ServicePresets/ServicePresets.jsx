import React, { useState } from "react";
import { useSelector } from "react-redux";
import { 
  useGetTemplatesQuery, 
  useCreateTemplateMutation, 
  useUpdateTemplateMutation, 
  useDeleteTemplateMutation,
  useGetSalonAssignedTemplatesQuery
} from "../../../store/api/templateApi";
import { useUser } from "../../../hooks/useUser";
import LoadingIndicator from "../../../components/common/LoadingIndicator/LoadingIndicator";
import TemplateCard from "../../../components/dashboard/admin/ServicePresets/TemplateCard";
import AddServiceModal from "../../../components/dashboard/saloon/Modals/AddServiceModal";
import { FiSearch, FiPlus } from "react-icons/fi";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

export default function ServicePresets() {
  const { user } = useUser();
  const isAdmin = user?.role === "admin";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // If Admin: fetch all templates. If Salon: fetch assigned templates.
  // Actually, for Salon Owner, the requirements said "show the templates assigned to them by admin".
  // So we use getSalonAssignedTemplatesQuery for salon-owner.
  
  const { 
    data: allTemplatesData, 
    isLoading: isAllLoading, 
    refetch: refetchAll 
  } = useGetTemplatesQuery({ page, search }, { skip: !isAdmin });

  const { 
    data: assignedTemplatesData, 
    isLoading: isAssignedLoading,
    refetch: refetchAssigned
  } = useGetSalonAssignedTemplatesQuery(undefined, { skip: isAdmin });

  const templates = isAdmin ? allTemplatesData?.data?.items : assignedTemplatesData?.data;
  const isLoading = isAdmin ? isAllLoading : isAssignedLoading;

  const [createTemplate] = useCreateTemplateMutation();

  const handleCreateTemplate = async (formData) => {
    try {
      await createTemplate(formData).unwrap();
      setIsAddModalOpen(false);
      refetchAll();
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="p-4 sm:p-7 flex flex-col gap-8 font-poppins min-h-screen bg-vmb-bg-soft">
      {/* Header section */}
      <div className="bg-white border border-vmb-primary/5 rounded-[12px] shadow-sm p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-vmb-primary font-bold text-[24px] sm:text-[28px]">
            {isAdmin ? "Templates" : "Browse Presets"}
          </h1>
          <p className="text-vmb-text-muted text-[14px]">
            {isAdmin ? "Manage your salon efficiently" : "Use pre-designed templates for your salon"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-vmb-text-muted/60" />
            <input
              type="text"
              placeholder="Search (salon, service)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-[300px] h-[45px] pl-10 pr-4 bg-vmb-bg-soft border border-vmb-primary/10 rounded-[10px] text-[14px] focus:outline-none focus:ring-1 focus:ring-vmb-secondary/50"
            />
          </div>
          <button className="h-[45px] px-4 flex items-center justify-center gap-2 border border-vmb-primary/10 rounded-[10px] text-vmb-text-muted bg-white hover:bg-vmb-bg-soft transition-colors shadow-sm">
            <span className="text-[14px] font-medium">Sort</span>
            <HiOutlineAdjustmentsHorizontal className="text-lg" />
          </button>
        </div>
      </div>

      {/* Templates Grid Content */}
      <div className="bg-white border border-vmb-primary/5 rounded-[12px] shadow-sm p-4 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-vmb-primary font-semibold text-[18px]">Templates</h2>
          {isAdmin && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-vmb-secondary hover:bg-vmb-secondary/90 text-white px-5 py-2.5 rounded-[8px] flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <FiPlus className="text-lg" />
              <span className="text-[14px] font-medium">Add Template</span>
            </button>
          )}
        </div>

        {(!templates || templates.length === 0) ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-vmb-bg-soft rounded-full flex items-center justify-center mb-2">
              <HiOutlineAdjustmentsHorizontal className="text-3xl text-vmb-text-muted/30" />
            </div>
            <p className="text-vmb-text-muted font-medium">No templates found</p>
            <p className="text-vmb-text-muted/60 text-sm">Templates created by admin will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {templates.map((template) => (
              <TemplateCard 
                key={template._id} 
                template={template} 
                isAdmin={isAdmin}
                onUpdate={isAdmin ? refetchAll : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Admin Add Template Modal */}
      {isAdmin && isAddModalOpen && (
        <AddServiceModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateTemplate}
          isTemplate={true}
        />
      )}
    </div>
  );
}
