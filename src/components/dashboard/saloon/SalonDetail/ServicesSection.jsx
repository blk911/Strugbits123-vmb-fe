import { Fragment, useState } from "react";
import {
  Listbox,
  Transition,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import ServiceCard from "./ServiceCard";
import { FaPlus } from "react-icons/fa";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useGetServicesQuery } from "../../../../store/api";
import AddServiceChoiceModal from "../Modals/AddServiceChoiceModal";

const sortOptions = [
  { label: "Sort by Price", value: "" },
  { label: "Price: Low → High", value: "asc" },
  { label: "Price: High → Low", value: "desc" },
];

const ChevronIcon = () => (
  <svg
    width="10"
    height="4"
    viewBox="0 0 10 4"
    xmlns="http://www.w3.org/2000/svg"
    className="text-vmb-text-muted"
  >
    <path
      d="M1.12478 0.00242486C1.33118 -0.0105214 1.48305 0.0903836 1.63055 0.205758C2.68394 1.03166 3.74317 1.85337 4.79023 2.68421C4.95914 2.81825 5.05115 2.80606 5.2113 2.67926C6.25933 1.8488 7.31759 1.02671 8.37147 0.201189C8.48732 0.110565 8.60512 0.0256521 8.77744 0.0062326C9.06123 -0.0257524 9.31144 0.0667756 9.43313 0.251451C9.55093 0.430034 9.51345 0.658117 9.31777 0.814234C8.87577 1.16759 8.4255 1.51524 7.97864 1.86517C7.1589 2.50639 6.34014 3.148 5.51894 3.78846C5.16164 4.06757 4.83745 4.07061 4.48648 3.79684C3.23643 2.82015 1.98784 1.84156 0.736821 0.865258C0.593221 0.75293 0.494404 0.632225 0.500246 0.465065C0.509981 0.193192 0.754831 0.00204409 1.12478 0.00242486Z"
      fill="currentColor"
    />
  </svg>
);

export default function ServicesSection() {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const limit = 9;
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetServicesQuery({ page, limit });
  const rawServices = response?.data?.items || [];
  const total = response?.data?.total || 0;
  const totalPages = response?.data?.pages || 1;
  const currentPage = response?.data?.page || 1;
  const { openModal } = useDashboardModal();

  const handleStartFromScratch = () => {
    setIsChoiceModalOpen(false);
    openModal("addService");
  };

  const services = [...rawServices].sort((a, b) => {
    if (sortOrder === "asc") return a.servicePrice - b.servicePrice;
    if (sortOrder === "desc") return b.servicePrice - a.servicePrice;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-[12px] p-8 text-center text-vmb-text-muted">
        Loading services...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-[12px] p-8 text-center text-red-500">
        Failed to load services.
      </div>
    );
  }
  return (
    <div className="bg-white border border-vmb-bg-soft rounded-[12px] shadow-md p-4 sm:p-5 md:p-6 w-full max-w-full">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row items-center justify-between">
        <h3 className="text-vmb-primary text-[18px] font-semibold">Services</h3>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="relative">
            <Listbox
              value={sortOptions.find((o) => o.value === sortOrder)}
              onChange={(opt) => setSortOrder(opt.value)}
            >
              <ListboxButton className="relative flex items-center w-full cursor-default rounded-md border border-vmb-primary/10 bg-white/50 py-2 pl-3 pr-10 text-left text-sm text-vmb-text-main focus:outline-none font-poppins font-medium min-w-[160px]">
                <span className="block truncate">
                  {sortOptions.find((o) => o.value === sortOrder)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronIcon />
                </span>
              </ListboxButton>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-vmb-bg-soft border border-vmb-primary/10 text-sm shadow-lg focus:outline-none z-50">
                  {sortOptions.map((opt) => (
                    <ListboxOption
                      key={opt.value}
                      value={opt}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-4 font-poppins font-semibold ${
                          active ?
                            "bg-vmb-secondary/10 text-vmb-primary"
                          : "text-vmb-text-muted"
                        }`
                      }
                    >
                      {opt.label}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </Listbox>
          </div>

          <button
            className="flex items-center gap-2 border border-vmb-primary/10 bg-vmb-secondary text-white text-[16px] py-2 px-4 rounded-[8px] cursor-pointer"
            onClick={() => setIsChoiceModalOpen(true)}
          >
            <FaPlus className="text-white" />
            Add Service
          </button>
        </div>
      </div>
      {services.length === 0 ?
        <p className="text-center text-vmb-text-muted py-10">
          No services added yet.
        </p>
      : <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isFetching}
                className="px-3 py-1 text-sm border border-vmb-primary/10 rounded-md text-vmb-text-muted disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vmb-bg-soft transition cursor-pointer"
              >
                Prev
              </button>
              <span className="text-sm text-vmb-text-muted">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isFetching}
                className="px-3 py-1 text-sm border border-vmb-primary/10 rounded-md text-vmb-text-muted disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vmb-bg-soft transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      }

      {isChoiceModalOpen && (
        <AddServiceChoiceModal
          isOpen={isChoiceModalOpen}
          onClose={() => setIsChoiceModalOpen(false)}
          onStartFromScratch={handleStartFromScratch}
        />
      )}
    </div>
  );
}
