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

const ITEMS_PER_PAGE = 80;

export default function SendTreatModal({
  isOpen,
  closeModal,
  initialData,
  onAccept,
}) {
  const [page, setPage] = useState(1);
  const [toastId, setToastId] = useState(null);

  const isViewMode = !!initialData?.status;

  const getStatusContent = () => {
    if (!isViewMode) return null;
    const status = initialData.status?.toLowerCase();
    if (status === "pending")
      return "Your invite has been delivered. They’ll receive your salon offer shortly. 💖";
    if (status === "claimed")
      return "Your invite has been claimed. They’ve successfully joined your salon! 💖";
    if (status === "unclaimed")
      return "Your invite has expired or remained unclaimed. 💖";
    return null;
  };

  const prefilledEmail = initialData?.email || initialData?.inviteeEmail || "";

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetServicesQuery({ page, limit: ITEMS_PER_PAGE }, { skip: !isOpen });

  const [createInvite, { isLoading: isSubmitting }] = useCreateInviteMutation();

  const services = response?.data?.items || [];
  const currentPage = response?.data?.page || 1;
  const totalPages = response?.data?.pages || 1;
  const filteredservices = services?.filter(
    (service) => service.salonId !== null,
  );
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
      discountPercentage: services[0]?.serviceDiscount || 10,
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
        return `Hi ${name},\nI want you to experience my salon with ${serviceName} at an exclusive discount!\nNew here? Sign up to get started. Already have an account? Visit Salon Invites to claim your offer.`;
      };

      setValue("message", generateMessage());
    }
  }, [isOpen, services, setValue]);

  useEffect(() => {
    if (!isViewMode && selectedServiceId && firstName) {
      const selectedService = services.find((s) => s._id === selectedServiceId);
      if (selectedService) {
        const name = firstName.trim() || "FirstName";
        const message = `Hi ${name},\nI want you to experience my salon with ${selectedService.serviceName} at an exclusive discount!\nNew here? Sign up to get started. Already have an account? Visit Salon Invites to claim your offer.`;
        setValue("message", message);
      }
    }
  }, [firstName, selectedServiceId, services, setValue, isViewMode]);

  useEffect(() => {
    if (isOpen) {
      // Fallback for names if firstName/lastName are missing but fullName exists
      const fullName = initialData?.fullName || "";
      const [fName, ...lNameParts] = fullName.split(" ");
      const lName = lNameParts.join(" ");

      const firstName = initialData?.firstName || fName || "";
      const lastName = initialData?.lastName || lName || "";

      // Fallback for service selection
      const serviceId =
        initialData?.services?._id ||
        (Array.isArray(initialData?.services) ?
          initialData?.services[0]?._id
        : null) ||
        initialData?.serviceId ||
        "";

      reset({
        firstName,
        lastName,
        email: prefilledEmail,
        serviceId,
        discountPercentage:
          initialData?.discountPercentage || services[0]?.serviceDiscount || 10,
        message: initialData?.message || "",
      });
      setPage(1);
    }
  }, [isOpen, prefilledEmail, reset, initialData, services]);
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
        className="relative z-50 font-poppins"
        onClose={closeModal}
      >
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-[4px]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="relative w-full max-w-[805px] bg-white/90 rounded-[12px] p-[20px] sm:p-[30px] shadow-lg flex flex-col gap-[20px] max-h-[90vh] overflow-y-auto custom-scrollbar">
                <IoClose
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-vmb-primary text-2xl cursor-pointer hover:opacity-70"
                />

                <h2 className="text-center text-vmb-secondary font-bold text-[20px] sm:text-[22px]">
                  {isViewMode ?
                    "You Have Sent Special Treat To Your Customer"
                  : "Send a Special Treat To Your Customer"}
                </h2>

                <p className="text-center text-vmb-text-muted text-[13px] sm:text-[14px] leading-[20px] max-w-[600px] mx-auto">
                  {isViewMode ?
                    getStatusContent()
                  : "Invite your customer to enjoy one of your salon services. Add a discount, include a short message, and send your invite instantly. 💖"
                  }
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-[20px]"
                >
                  <div className="flex flex-col lg:flex-row gap-[20px] justify-between">
                    <div className="w-full lg:w-[428px] flex flex-col gap-[16px]">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="email"
                              readOnly={!!prefilledEmail || isViewMode}
                              placeholder="Email"
                              className={`w-full border rounded-[8px] p-3 text-[14px] focus:outline-none focus:border-vmb-secondary ${
                                errors.email ? "border-red-500" : (
                                  "border-vmb-primary/10"
                                )
                              } ${
                                prefilledEmail || isViewMode ? "bg-vmb-bg-soft"
                                : ""
                              }`}
                            />
                          )}
                        />

                        <Controller
                          name="discountPercentage"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              min="0"
                              max="99"
                              readOnly={isViewMode}
                              value={
                                field.value === 0 ? "" : (field.value ?? "")
                              }
                              onChange={(e) => {
                                if (isViewMode) return;
                                const val = e.target.value;
                                field.onChange(val === "" ? "" : Number(val));
                              }}
                              placeholder="Discount %"
                              className={`w-full border rounded-[8px] p-3 text-[14px] focus:outline-none focus:border-vmb-secondary ${
                                errors.discountPercentage ? "border-red-500" : (
                                  "border-vmb-primary/10"
                                )
                              } ${isViewMode ? "bg-vmb-bg-soft" : ""}`}
                            />
                          )}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Controller
                          name="firstName"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              readOnly={isViewMode}
                              placeholder="First Name"
                              className={`w-full border rounded-[8px] p-3 text-[14px] focus:outline-none focus:border-vmb-secondary ${
                                errors.firstName ? "border-red-500" : (
                                  "border-vmb-primary/10"
                                )
                              } ${isViewMode ? "bg-vmb-bg-soft" : ""}`}
                            />
                          )}
                        />

                        <Controller
                          name="lastName"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              readOnly={isViewMode}
                              placeholder="Last Name"
                              className={`w-full border rounded-[8px] p-3 text-[14px] focus:outline-none focus:border-vmb-secondary ${
                                errors.lastName ? "border-red-500" : (
                                  "border-vmb-primary/10"
                                )
                              } ${isViewMode ? "bg-vmb-bg-soft" : ""}`}
                            />
                          )}
                        />
                      </div>

                      <Controller
                        name="message"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={5}
                            readOnly={isViewMode}
                            placeholder="Type your message..."
                            className={`w-full h-[156px] border border-vmb-primary/10 rounded-[8px] p-3 text-[12px] italic text-vmb-text-muted resize-none outline-none focus:border-vmb-secondary ${
                              isViewMode ? "bg-vmb-bg-soft" : ""
                            }`}
                          />
                        )}
                      />
                    </div>

                    <div className="w-full lg:w-[305px] border border-vmb-primary/10 bg-vmb-bg-soft rounded-[8px] p-4 flex flex-col">
                      <p className="text-[14px] font-medium text-vmb-text-main mb-4">
                        Choose Service
                      </p>

                      {isLoading ?
                        <p className="text-center py-6 text-vmb-text-muted">
                          Loading services...
                        </p>
                      : filteredservices.length === 0 ?
                        <p className="text-center py-6 text-vmb-text-muted">
                          No services found.
                        </p>
                      : <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
                          {filteredservices.map((srv) => (
                            <label
                              key={srv._id}
                              className={`flex items-center gap-3 p-2 rounded-lg transition ${
                                selectedServiceId === srv._id ?
                                  "bg-vmb-secondary/10 border border-vmb-secondary/20"
                                : "hover:bg-vmb-bg-soft border border-transparent"
                              } ${
                                isViewMode ? "cursor-default" : "cursor-pointer"
                              }`}
                            >
                              <input
                                type="radio"
                                disabled={isViewMode}
                                checked={selectedServiceId === srv._id}
                                onChange={() => {
                                  if (isViewMode) return;
                                  setValue("serviceId", srv._id, {
                                    shouldValidate: true,
                                  });
                                  setValue(
                                    "discountPercentage",
                                    srv?.serviceDiscount ?? 0,
                                    { shouldValidate: true },
                                  );

                                  const name =
                                    watch("firstName").trim() || "{FirstName}";
                                  const message = `Hi ${name},\nI want you to experience my salon with ${srv.serviceName} at an exclusive discount!`;
                                  setValue("message", message);
                                }}
                                className="w-4 h-4"
                                style={{ accentColor: "var(--vmb-primary)" }}
                              />

                              <img
                                src={srv.serviceImage || "/default-service.jpg"}
                                alt={srv.serviceName}
                                className="w-10 h-10 rounded-md object-cover"
                              />

                              <div>
                                <p className="text-[13px] font-semibold text-vmb-text-main">
                                  {srv.serviceName}
                                </p>
                                <p className="text-[12px] font-bold text-vmb-secondary">
                                  ${srv.servicePrice}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      }
                    </div>
                  </div>

                  {!isViewMode && (
                    <AppButton
                      type="submit"
                      variant="primary"
                      size="custom"
                      className="w-full max-w-[745px] mx-auto text-[16px] font-medium py-3"
                      disabled={
                        !isValid || isSubmitting || !filteredservices?.length
                      }
                    >
                      {isSubmitting ? "Sending Invite..." : "Invite Now"}
                    </AppButton>
                  )}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
