import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AppButton from "../../../common/site/AppButton";
import {
  useGetServicesQuery,
  useCreateInviteMutation,
} from "../../../../store/api";
import {
  toastSuccess,
  toastError,
  toastLoading,
  toastDismiss,
} from "../../../../utils/toast";

const inviteSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name is required")
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid name"),
  lastName: z
    .string()
    .min(2, "Last name is required")
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid name"),
  email: z.string().email("Please enter a valid email"),
  serviceId: z.string({ required_error: "Please select a service" }),
  discountPercentage: z
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0, "Discount cannot be negative")
    .max(99, "Discount cannot exceed 99%")
    .default(0),
  message: z.string().optional(),
});

const ITEMS_PER_PAGE = 9;

export default function SendTreatModal({
  isOpen,
  closeModal,
  initialData,
  onAccept,
}) {
  const [page, setPage] = useState(1);
  const [toastId, setToastId] = useState(null);

  const prefilledEmail = initialData?.email || "";

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetServicesQuery({ page, limit: ITEMS_PER_PAGE }, { skip: !isOpen });

  const [createInvite, { isLoading: isSubmitting }] = useCreateInviteMutation();

  const services = response?.data?.items || [];
  const currentPage = response?.data?.page || 1;
  const totalPages = response?.data?.pages || 1;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(inviteSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: prefilledEmail,
      serviceId: "",
      discountPercentage: services[0]?.serviceDiscount,
      message: ``,
    },
  });

  const selectedServiceId = watch("serviceId");
  const firstName = watch("firstName");
  useEffect(() => {
    if (isOpen && services.length > 0) {
      const firstService = services[0];

      setValue("serviceId", firstService._id, { shouldValidate: true });

      const generateMessage = () => {
        const serviceName = firstService.serviceName;
        const name = firstName.trim() || "{FirstName}";
        return `Hi ${name},\nI want you to experience my salon with ${serviceName} at an exclusive discount!\nSignup and book today.`;
      };

      setValue("message", generateMessage());
    }
  }, [isOpen, services, setValue]);

  useEffect(() => {
    if (selectedServiceId && firstName) {
      const selectedService = services.find((s) => s._id === selectedServiceId);
      if (selectedService) {
        setValue("discountPercentage", selectedService?.serviceDiscount ?? 0, {
        shouldValidate: true,
      });
        const name = firstName.trim() || "{FirstName}";
        const message = `Hi ${name},\nI want you to experience my salon with ${selectedService.serviceName} at an exclusive discount!\nSignup and book today.`;
        setValue("message", message);
      }
    }
  }, [firstName, selectedServiceId, services, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset({
        firstName: "",
        lastName: "",
        email: prefilledEmail,
        serviceId: "",
        discountPercentage: services[0].serviceDiscount,
        message: "",
      });
      setPage(1);
    }
  }, [isOpen, prefilledEmail, reset]);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setPage(newPage);
    }
  };

  const onSubmit = async (data) => {
    const loadingToast = toastLoading("Sending your invite...");
    setToastId(loadingToast);

    try {
      await createInvite({
        services: [data.serviceId],
        inviteeEmail: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        discountPercentage: data.discountPercentage,
        message: data.message || "",
      }).unwrap();

      toastDismiss(loadingToast);
      toastSuccess("Invite sent successfully!");
      closeModal();
      onAccept?.();
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to send invite");
      console.error("Invite failed:", err);
    }
  };

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

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="relative w-full max-w-[616px] rounded-[10px] bg-[#FFFFFFE5] p-[30px] shadow-lg flex flex-col gap-[12px] max-h-[90vh] overflow-y-auto custom-scrollbar">
                <IoClose
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer hover:opacity-70"
                />

                <h2 className="text-center text-[#FF92A5] font-bold text-[22px]">
                  Send a Special Treat To Your Customer
                </h2>

                <p className="text-center text-[#00000080] text-[14px] leading-[20px]">
                  Invite your customer to enjoy one of your salon services.  Add
                  a discount, include a short message, and send your invite
                  instantly. 💖
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="text-[14px] font-medium text-[#374151]">
                      Email
                    </label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          readOnly={!!prefilledEmail}
                          placeholder="Enter email"
                          className={`w-full border rounded-[8px] p-3 text-[14px] mt-1 focus:outline-none focus:border-[#FF92A5] ${
                            errors.email ? "border-red-500" : "border-[#E5E5E5]"
                          } ${prefilledEmail ? "bg-gray-50" : ""}`}
                        />
                      )}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[14px] font-medium text-[#374151]">
                        First Name
                      </label>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            {...field}
                            value={value || ""}
                            placeholder="First Name"
                            onChange={(e) => {
                              let newValue = e.target.value;
                              if (newValue.startsWith(" ")) {
                                newValue = newValue.trimStart();
                              }
                              e.target.value = newValue;
                              onChange(newValue);
                            }}
                            className={`w-full border rounded-[8px] p-3 text-[14px] mt-1 focus:outline-none focus:border-[#FF92A5] ${
                              errors.firstName
                                ? "border-red-500"
                                : "border-[#E5E5E5]"
                            }`}
                          />
                        )}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[14px] font-medium text-[#374151]">
                        Last Name
                      </label>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            {...field}
                            value={value || ""}
                            placeholder="Last Name"
                            onChange={(e) => {
                              let newValue = e.target.value;
                              if (newValue.startsWith(" ")) {
                                newValue = newValue.trimStart();
                              }
                              e.target.value = newValue;
                              onChange(newValue);
                            }}
                            className={`w-full border rounded-[8px] p-3 text-[14px] mt-1 focus:outline-none focus:border-[#FF92A5] ${
                              errors.lastName
                                ? "border-red-500"
                                : "border-[#E5E5E5]"
                            }`}
                          />
                        )}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-4 ">
                    <p className="text-[14px] font-medium text-[#404040] mb-4">
                      Choose Service
                    </p>

                    {isLoading ? (
                      <p className="text-center py-8 text-gray-500">
                        Loading services...
                      </p>
                    ) : services.length === 0 ? (
                      <p className="text-center py-8 text-gray-500">
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
                              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#FFF4F6] transition"
                            >
                              <input
                                type="radio"
                                name="service"
                                checked={selectedServiceId === srv._id}
                                onChange={() => {
                                  setValue("serviceId", srv._id, {
                                    shouldValidate: true,
                                  });
                                 setValue("discountPercentage", srv?.serviceDiscount ?? 0, {shouldValidate: true,});
                                  const name =
                                    watch("firstName").trim() || "${FirstName}";
                                  const message = `Hi ${name},\nI want you to experience my salon with ${srv.serviceName} at an exclusive discount!\nSignup and book today.`;
                                  setValue("message", message);
                                }}
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

                        {errors.serviceId && (
                          <p className="text-red-500 text-xs mt-2">
                            {errors.serviceId.message}
                          </p>
                        )}

                        {totalPages > 1 && (
                          <div className="flex justify-center gap-3 mt-6 pt-4 border-t">
                            <button
                              type="button"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1 || isFetching}
                              className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <span className="text-sm text-gray-600 self-center">
                              Page {currentPage} of {totalPages}
                            </span>
                            <button
                              type="button"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={
                                currentPage === totalPages || isFetching
                              }
                              className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50"
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
                    <Controller
                      name="discountPercentage"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="0"
                          max="99"
                          value={field.value === 0 ? "" : field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? "" : Number(val));
                          }}
                          placeholder="e.g. 20"
                          className="w-full border border-[#9CA3AF4D] bg-[#FFFFFF4D] rounded-[8px] p-3 mt-1 text-[14px]"
                        />
                      )}
                    />
                    {errors.discountPercentage && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.discountPercentage.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[14px] font-medium text-[#404040]">
                      Write your message
                    </label>
                    <Controller
                      name="message"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <textarea
                          {...field}
                          value={value || ""}
                          rows={4}
                          placeholder="Type your message..."
                          onChange={(e) => {
                            let newValue = e.target.value;
                            if (newValue.startsWith(" ")) {
                              newValue = newValue.trimStart();
                            }
                            e.target.value = newValue;
                            onChange(newValue);
                          }}
                          className="w-full border border-[#E5E5E5] bg-white rounded-[8px] p-3 mt-1 text-[12px] italic text-[#00000080] resize-none outline-none focus:border-[#FF92A5]"
                        />
                      )}
                    />
                  </div>

                  <AppButton
                    type="submit"
                    variant="primary"
                    size="custom"
                    className="w-full text-[16px] font-medium py-3"
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? "Sending Invite..." : "Invite Now"}
                  </AppButton>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
