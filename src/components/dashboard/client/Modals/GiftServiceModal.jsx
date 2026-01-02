import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { IoClose, IoChevronDown, IoCopyOutline } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AppButton from "../../../common/site/AppButton";
import CustomCheckbox from "../../../common/site/CustomCheckbox";
import { useCreateGiftMutation } from "../../../../store/api";
import {
  toastSuccess,
  toastError,
  toastLoading,
  toastDismiss,
} from "../../../../utils/toast";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

const giftSchema = z.object({
  selectedServices: z
    .array(z.string())
    .min(1, "Please select at least one service"),
  email: z.string().email("Please enter a valid email"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .optional(),
});

export default function GiftServiceModal({ isOpen, closeModal, initialData }) {
  const dropdownRef = useRef(null);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copyToastId, setCopyToastId] = useState(null);
  const [toastId, setToastId] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const salon = initialData?.salon;
  const prefilledService = initialData?.service;

  const [createGift, { isLoading }] = useCreateGiftMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(giftSchema),
    mode: "onChange",
    defaultValues: {
      selectedServices: [],
      email: "",
      message: "",
    },
  });

  const selectedServices = watch("selectedServices") || [];
  useEffect(() => {
    if (!isOpen) return;

    if (salon && initialData) {
      const prefilledEmail = initialData.email || "";
      const prefilledMessage =
        initialData.message ||
        `Hi! I’ve sent you a request to pay for my treat. Once the payment is complete, I’ll finalize the booking. Thanks! 💕`;
      const prefilledServiceName = prefilledService?.serviceName;
      const defaultServices = prefilledServiceName
        ? [prefilledServiceName]
        : [];

      reset({
        selectedServices: defaultServices,
        email: prefilledEmail,
        message: prefilledMessage,
      });

      setIsSubmitted(initialData.isSubmitted ?? false);
      if (toastId) toastDismiss(toastId);
    } else {
      reset({
        selectedServices: [],
        email: "",
        message: "",
      });
      setIsSubmitted(false);
    }
  }, [isOpen, salon, initialData, prefilledService, reset, toastId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServiceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleService = (serviceName) => {
    const current = selectedServices || [];
    const updated = current.includes(serviceName)
      ? current.filter((s) => s !== serviceName)
      : [...current, serviceName];
    setValue("selectedServices", updated, { shouldValidate: true });
  };

  const getServiceByName = (name) =>
    salon?.services?.find((s) => s.serviceName === name);

  const totalPrice = selectedServices.reduce((sum, name) => {
    const svc = getServiceByName(name);
    return sum + (svc ? Number(svc.servicePrice) : 0);
  }, 0);
  const findtotalPrice = (data) => {
    return data.reduce((sum, name) => {
      const svc = getServiceByName(name);
      return sum + (svc ? Number(svc.servicePrice) : 0);
    }, 0);
  };
  const onSubmit = async (data) => {
    if (!salon?._id) {
      toastError("Salon not found");
      return;
    }

    const serviceIds = selectedServices
      .map((name) => getServiceByName(name)?._id)
      .filter(Boolean);

    if (serviceIds.length === 0) {
      toastError("No valid services selected");
      return;
    }

    const payload = {
      salonId: salon._id,
      services: serviceIds,
      receiverEmail: data.email,
      message: data.message || "",
    };

    const loadingToast = toastLoading("Sending your gift request...");
    setToastId(loadingToast);

    try {
      await createGift(payload).unwrap();
      toastDismiss(loadingToast);
      toastSuccess("Gift request sent successfully!");
      setSubmittedData(data);
      setIsSubmitted(true);
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to send gift request");
      console.error("Gift creation failed:", err);
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
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment}>
              <Dialog.Panel
                className={`relative w-full max-w-[448px] rounded-[20px] border border-[#5818381A] ${
                  isSubmitted ? "bg-[#e8e8e8]" : "bg-white"
                } p-[30px] shadow-xl transition-all flex flex-col gap-8`}
              >
                <IoClose
                  onClick={closeModal}
                  className="absolute top-6 right-6 text-[#581838] text-3xl cursor-pointer hover:opacity-80"
                />

                {isLoading ? (
                  <div className="flex justify-center">
                    <LoadingIndicator />
                  </div>
                ) : !isSubmitted ? (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h3 className="text-[#581838] font-bold text-2xl">
                        Gift Service
                      </h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <img
                        src={salon?.profilePic || salon?.salonPhotos?.[0]}
                        alt={salon?.salonName}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                      <div>
                        <p className="text-[#4B5563] font-semibold text-xl">
                          {salon?.salonName}
                        </p>
                        <p className="text-[#4B5563] text-xs">
                          {salon?.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                      <label className="text-[#404040] text-sm font-medium">
                        Select Services
                      </label>
                      <div
                        onClick={() =>
                          setServiceDropdownOpen(!serviceDropdownOpen)
                        }
                        className="w-full mt-2 border border-[#E5E5E5] rounded-lg py-3 px-4 pr-10 text-sm flex justify-between items-center cursor-pointer flex-wrap gap-2 min-h-[48px] bg-white  max-h-28 overflow-y-auto custom-scrollbar"
                      >
                        {selectedServices.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedServices.map((srv) => (
                              <div
                                key={srv}
                                className="flex items-center gap-2 bg-[#64748B] text-white rounded-md px-3 py-1.5 text-xs"
                              >
                                <span>{srv}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleService(srv);
                                  }}
                                  className="w-5 h-5 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[#00000080]">
                            Choose services...
                          </span>
                        )}
                        <IoChevronDown
                          className={`ml-auto text-[#581838] transition-transform ${
                            serviceDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {serviceDropdownOpen && salon?.services && (
                        <div className="absolute w-full bg-white border border-[#E5E5E5] rounded-lg mt-2 p-4 z-10 shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                          {salon.services.map((svc) => (
                            <CustomCheckbox
                              key={svc._id}
                              label={`${svc.serviceName} (${svc.serviceDuration} min - $${svc.servicePrice})`}
                              checked={selectedServices.includes(
                                svc.serviceName
                              )}
                              onChange={() => toggleService(svc.serviceName)}
                            />
                          ))}
                        </div>
                      )}
                      {errors.selectedServices && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.selectedServices.message}
                        </p>
                      )}
                    </div>

                    {selectedServices.length > 0 && (
                      <div className="border border-[#5818381A] bg-[#F2F2F2] rounded-md p-4 max-h-32 overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between text-xs font-medium mb-2">
                          <span>Service</span>
                          <span>Duration</span>
                          <span>Price</span>
                        </div>
                        {selectedServices.map((name) => {
                          const s = getServiceByName(name);
                          return (
                            <div
                              key={name}
                              className="border-b border-[#D9D9D9] py-2 flex justify-between text-xs text-[#4B5563]"
                            >
                              <span>{s?.serviceName}</span>
                              <span>{s?.serviceDuration} min</span>
                              <span>${s?.servicePrice}</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-end font-bold text-[#581838] mt-3">
                          Total: ${totalPrice.toFixed(2)}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-[#581838] font-bold text-xl">
                        Who’s treating you?
                      </h4>
                      <label className="text-[#404040] text-sm font-medium mt-3 block">
                        Email
                      </label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            {...field}
                            value={value || ""}
                            type="text"
                            placeholder="Enter email..."
                            onChange={(e) => {
                              let newValue = e.target.value;

                              if (newValue.startsWith(" ")) {
                                newValue = newValue.trimStart();
                              }

                              e.target.value = newValue;

                              onChange(newValue);
                            }}
                            className={`w-full border rounded-lg px-4 py-3 text-sm mt-1 focus:outline-none focus:border-[#FF92A5] ${
                              errors.email
                                ? "border-red-500"
                                : "border-[#E5E5E5]"
                            }`}
                          />
                        )}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}

                      <label className="text-[#404040] text-sm font-medium mt-4 block">
                        Write a sweet message
                      </label>
                      <Controller
                        name="message"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={3}
                            placeholder="Type your message..."
                            className="w-full border border-[#E5E5E5] rounded-lg p-4 text-sm text-[#00000080] mt-1 resize-none focus:outline-none focus:border-[#FF92A5]"
                          />
                        )}
                      />
                    </div>

                    <AppButton
                      type="submit"
                      variant="primary"
                      size="custom"
                      disabled={!isValid || isLoading}
                      isLoading={isLoading}
                      className="text-[14px] py-[15px] font-medium"
                    >
                      {isLoading ? "Sending..." : "Request Now"}
                    </AppButton>
                  </form>
                ) : (
                  <div className="text-center space-y-6">
                    <h3 className="text-[#FF92A5] font-bold text-2xl">
                      Treat Request Sent!
                    </h3>
                    <p className="text-[#00000080] text-sm leading-5">
                      Your request has been shared successfully.
                      <br />
                      Wait for payment confirmation.
                    </p>

                    <div className="border border-[#FF92A5] bg-white rounded-xl p-4 space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={salon?.profilePic}
                          alt={salon?.salonName}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="text-left">
                          <p className="font-semibold text-xl">
                            {salon?.salonName}
                          </p>
                          <p className="text-xs text-[#4B5563]">
                            {salon?.description}
                          </p>
                        </div>
                      </div>
                      <div className="border border-[#5818381A] bg-[#F2F2F2] rounded-md p-4">
                        <div className="flex justify-between text-xs font-medium mb-2">
                          <span>Service</span>
                          <span>Duration</span>
                          <span>Price</span>
                        </div>
                        {submittedData.selectedServices.map((name) => {
                          const s = getServiceByName(name);
                          return (
                            <div
                              key={name}
                              className="border-b border-[#D9D9D9] py-2 flex justify-between text-xs text-[#4B5563]"
                            >
                              <span>{s?.serviceName}</span>
                              <span>{s?.serviceDuration} min</span>
                              <span>${s?.servicePrice}</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-end font-bold text-[#581838] mt-3">
                          Total: $
                          {findtotalPrice(
                            submittedData.selectedServices
                          ).toFixed(2)}
                        </div>
                      </div>

                      <div className="text-left">
                        <h4 className="text-[#581838] font-bold text-xl">
                          Who’s treating you?
                        </h4>
                        <label className="text-[#404040] text-sm mt-3 block">
                          Email
                        </label>
                        <input
                          readOnly={true}
                          type="email"
                          value={submittedData?.email}
                          className={`w-full border rounded-lg px-4 py-3 text-sm mt-1 focus:outline-none focus:border-[#FF92A5] `}
                        />

                        <label className="text-[#404040] text-sm mt-4 block">
                          Write a sweet message
                        </label>

                        <textarea
                          readOnly
                          value={submittedData?.message}
                          rows={3}
                          placeholder="Type your message..."
                          className="w-full border border-[#E5E5E5] rounded-lg p-4 text-sm mt-1 resize-none focus:outline-none focus:border-[#FF92A5]"
                        />
                      </div>
                    </div>

                    <div className="text-sm italic text-[#00000080]">
                      Copy link to share this gift request.
                      <div className="border border-[#0000001A] bg-white rounded-xl flex justify-between items-center px-4 py-3 mt-2">
                        <span className="truncate">
                          {import.meta.env.VITE_FRONTEND_URL + `gifts`}
                        </span>
                        <IoCopyOutline
                                       onClick={() => {
    if (copyToastId) {
      toastDismiss(copyToastId);
    }
    navigator.clipboard.writeText(
      import.meta.env.VITE_FRONTEND_URL + `gifts`
    );
    const newToastId = toastSuccess("Link copied!");
    setCopyToastId(newToastId);
  }}
                          className="text-[#FF92A5] text-2xl cursor-pointer hover:opacity-80"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
