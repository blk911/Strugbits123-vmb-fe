import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useGetServicesQuery } from "../../../../store/api";
import AppButton from "../../../common/site/AppButton";

const ITEMS_PER_PAGE = 9;

export default function SendTreatModal({
  isOpen,
  closeModal,
  initialData,
  onAccept,
}) {
  const [selectedService, setSelectedService] = useState(null);
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetServicesQuery({ page, limit: ITEMS_PER_PAGE }, { skip: !isOpen });

  const services = response?.data?.items || [];
  const currentPage = response?.data?.page || 1;
  const totalPages = response?.data?.pages || 1;

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setSelectedService(null);
    }
  }, [isOpen]);

  const toggleService = (id) => {
    setSelectedService((prev) => (prev === id ? null : id));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setPage(newPage);
    }
  };

  const handleInvite = () => {
    if (!selectedService) return;
    closeModal();
    setTimeout(() => onAccept?.(selectedService), 200);
  };

  const prefilledEmail = initialData?.email || "";

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-[Poppins]"
        onClose={closeModal}
      >
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[4px]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="relative w-full max-w-[616px] rounded-[10px] bg-[#FFFFFFE5] p-[30px] shadow-lg flex flex-col gap-[12px] max-h-[90vh] overflow-y-auto">
                <IoClose
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer hover:opacity-70"
                />

                <h2 className="text-center text-[#FF92A5] font-bold text-[22px]">
                  Send a Special Treat To Your Customer
                </h2>

                <p className="text-center text-[#00000080] text-[14px] leading-[20px]">
                  Invite your customer to enjoy one of your salon services. Add
                  a discount, include a short message, and send your invite
                  instantly.
                </p>

                <div>
                  <label className="text-[14px] font-medium text-[#374151]">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={prefilledEmail}
                    readOnly
                    className="w-full border border-[#E5E5E5] bg-gray-50 rounded-[8px] p-3 mt-1 text-[14px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[14px] font-medium text-[#374151]">
                      First Name
                    </label>
                    <input
                      className="w-full border border-[#E5E5E5] bg-white rounded-[8px] p-3 mt-1 text-[14px]"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-medium text-[#374151]">
                      Last Name
                    </label>
                    <input
                      className="w-full border border-[#E5E5E5] bg-white rounded-[8px] p-3 mt-1 text-[14px]"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] font-medium text-[#404040]">
                      Choose Service
                    </p>
                    {totalPages > 1 && (
                      <p className="text-xs text-gray-500">
                        Page {currentPage} of {totalPages}
                      </p>
                    )}
                  </div>

                  {isError ? (
                    <p className="text-red-500 text-center py-8">
                      Failed to load services.
                    </p>
                  ) : services.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">
                      No services found.
                    </p>
                  ) : (
                    <>
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto no-scrollbar"
                        style={{ scrollbarWidth: "none" }}
                      >
                        {services.map((srv) => (
                          <label
                            key={srv._id}
                            className="flex items-center gap-3 p-3  rounded-lg cursor-pointer hover:bg-[#FFF4F6] transition"
                          >
                            <input
                              type="radio"
                              name="service"
                              checked={selectedService === srv._id}
                              onChange={() => toggleService(srv._id)}
                              className="w-4 h-4 text-[#581838]"
                              style={{ accentColor: "#581838" }}
                            />
                            <img
                              src={srv.serviceImage || "/default-service.jpg"}
                              alt={srv.serviceName}
                              className="w-12 h-12 rounded-md object-cover shadow-sm border border-[#FFFFFFB2]"
                            />
                            <div>
                              <p className="text-[14px] font-semibold text-[#4B5563]">
                                {srv.serviceName}
                              </p>
                              <p className="text-[13px] font-bold text-[#FF92A5]">
                                ${srv.servicePrice}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || isFetching}
                            className="px-4 py-2 text-sm border border-[#D1D5DB] rounded-lg text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                          >
                            Previous
                          </button>

                          <div className="flex gap-2">
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((p) => (
                              <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`w-8 h-8 rounded-md text-sm transition ${
                                  currentPage === p
                                    ? "bg-[#FF92A5] text-white"
                                    : "border border-gray-300 hover:bg-gray-100"
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || isFetching}
                            className="px-4 py-2 text-sm border border-[#D1D5DB] rounded-lg text-[#4B5563] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <label className="text-[14px] font-medium text-[#404040]">
                    Service Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 20"
                    className="w-full border border-[#9CA3AF4D] bg-[#FFFFFF4D] rounded-[8px] p-3 mt-1 text-[14px]"
                  />
                </div>

                <div>
                  <label className="text-[14px] font-medium text-[#404040]">
                    Write your message
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={`Hi Juliana,\nI want you to experience my salon with a special treat!\nSignup and book today.`}
                    className="w-full border border-[#E5E5E5] bg-white rounded-[8px] p-3 mt-1 text-[12px] italic text-[#00000080] resize-none outline-none"
                  />
                </div>

                <AppButton
                  variant="primary"
                  size="custom"
                  className="text-[16px] font-medium py-3"
                  onClick={handleInvite}
                  disabled={!selectedService}
                >
                  {selectedService ? "Invite Now" : "Please Select a Service"}
                </AppButton>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
