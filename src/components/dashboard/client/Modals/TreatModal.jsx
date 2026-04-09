import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { IoClose, IoCopyOutline, IoChevronDown } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AppButton from "../../../common/site/AppButton";
import CustomCheckbox from "../../../common/site/CustomCheckbox";
import {
  useCreateGiftMutation,
  useGetAllSalonsQuery,
} from "../../../../store/api";
import { formatDuration } from "../../../../utils/HelperFunctions";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../../../utils/toast";
import { useUser } from "../../../../hooks/useUser";
import SalonImage from "../../../../assets/salon-1.png";
const createSchema = (hasServices) =>
  z.object({
    salonId: z.string().min(1, "Please select a salon"),
    selectedServices: z
      .array(z.string())
      .min(
        1,
        hasServices ?
          "Please select at least one service"
        : "No services available",
      ),
    email: z.string().email("Please enter a valid email"),
    message: z
      .string()
      .min(5, "Message must be at least 5 characters")
      .optional(),
  });

export default function TreatModal({ isOpen, closeModal, initialData }) {
  const gift = initialData?.gift;
  const [copyToastId, setCopyToastId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [salonDropdownOpen, setSalonDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const { user } = useUser();
  const salonDropdownRef = useRef(null);
  const serviceDropdownRef = useRef(null);
  const [createGift, { isLoading }] = useCreateGiftMutation();
  const { data: salonsResponse, isLoading: loadingSalons } =
    useGetAllSalonsQuery({
      search: searchTerm,
      limit: 50,
      userLng: user?.location?.coordinates?.[0] ?? null,
      userLat: user?.location?.coordinates?.[1] ?? null,
    });

  const salons = salonsResponse?.data?.items || [];
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(createSchema(true)),
    mode: "onChange",
    defaultValues: {
      salonId: "",
      selectedServices: [],
      email: "",
      message:
        "Hi! I’ve sent you a request to pay for my treat. Once the payment is complete, I’ll finalize the booking. Thanks! 💕",
    },
  });

  const selectedSalonId = watch("salonId");
  const selectedServices = watch("selectedServices") || [];

  const selectedSalon = salons.find((s) => s._id === selectedSalonId);
  const hasServices = selectedSalon?.services?.length > 0;

  useEffect(() => {
    if (selectedSalonId) {
      const schema = createSchema(hasServices);
      trigger();
    }
  }, [selectedSalonId, hasServices, trigger]);

  useEffect(() => {
    if (isOpen && gift) {
      setIsSubmitted(true);
      setSubmittedData(null);
    } else if (isOpen) {
      reset({
        salonId: "",
        selectedServices: [],
        email: "",
        message:
          "Hi! I’ve sent you a request to pay for my treat. Once the payment is complete, I’ll finalize the booking. Thanks! 💕",
      });
      setIsSubmitted(false);
      setSubmittedData(null);
    }
  }, [isOpen, gift, reset]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        salonDropdownRef.current &&
        !salonDropdownRef.current.contains(event.target)
      ) {
        setSalonDropdownOpen(false);
      }
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target)
      ) {
        setServiceDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getServiceByName = (name) =>
    selectedSalon?.services?.find((s) => s.serviceName === name);
  const totalPrice = selectedServices.reduce((sum, name) => {
    const svc = getServiceByName(name);
    return sum + (svc ? Number(svc.servicePrice) : 0);
  }, 0);
  const vmbFee = totalPrice * 0.1;
  const total = totalPrice + vmbFee;
  const toggleService = (serviceName) => {
    const updated =
      selectedServices.includes(serviceName) ?
        selectedServices.filter((s) => s !== serviceName)
      : [...selectedServices, serviceName];
    setValue("selectedServices", updated, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const serviceIds = selectedServices
      .map((name) => getServiceByName(name)?._id)
      .filter(Boolean);

    if (serviceIds.length === 0) {
      toastError("No valid services selected");
      return;
    }

    const payload = {
      salonId: data.salonId,
      services: serviceIds,
      receiverEmail: data.email,
      message: data.message || "",
    };

    const loadingToast = toastLoading("Sending your gift request...");

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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-poppins"
        onClose={closeModal}
      >
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child as={Fragment}>
              <Dialog.Panel
                className={`relative w-full max-w-[408px] rounded-2xl ${
                  isSubmitted ? "bg-vmb-modal-bg" : "bg-vmb-modal-bg"
                }  p-6 sm:p-8 shadow-xl transition-all backdrop-filter backdrop-blur-sm`}
              >
                <IoClose
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-vmb-primary text-2xl cursor-pointer"
                />

                {!isSubmitted ?
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-vmb-primary font-bold text-[24px]">
                        Treat Me, Baby!
                      </h3>
                      <p className="text-vmb-text-muted italic text-[14px] mt-1">
                        Get pampered — request a treat from <br /> someone you
                        love!
                      </p>
                    </div>

                    <div className="relative" ref={salonDropdownRef}>
                      <label className="text-vmb-text-main text-[14px] font-medium">
                        Select Salon
                      </label>
                      <Controller
                        name="salonId"
                        control={control}
                        render={({ field }) => (
                          <div
                            onClick={() =>
                              setSalonDropdownOpen(!salonDropdownOpen)
                            }
                            className="w-full mt-1 border border-vmb-primary/10 rounded-[8px] py-3 px-4 pr-10 text-sm flex justify-between items-center cursor-pointer bg-white"
                          >
                            <span
                              className={
                                field.value ? "text-black" : (
                                  "text-vmb-text-muted/50"
                                )
                              }
                            >
                              {field.value ?
                                salons.find((s) => s._id === field.value)
                                  ?.salonName || "Select salon"
                              : "Find your salon.."}
                            </span>
                            <IoChevronDown
                              className={`text-vmb-primary transition-transform ${
                                salonDropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        )}
                      />
                      {salonDropdownOpen && (
                        <div className="absolute top-full mt-2 w-full bg-white border border-vmb-primary/10 rounded-[8px] shadow-lg z-10 max-h-60 overflow-y-auto custom-scrollbar">
                          <input
                            type="text"
                            placeholder="Search salons..."
                            value={searchTerm}
                            onChange={(e) => {
                              let value = e.target.value;

                              if (value.startsWith(" ")) {
                                value = value.trimStart();
                                e.target.value = value;
                              }

                              setSearchTerm(value);
                            }}
                            className="w-full px-4 py-3 border-b border-vmb-primary/10 focus:outline-none"
                            autoFocus
                          />
                          {loadingSalons ?
                            <div className="p-4 text-center text-vmb-text-muted">
                              Loading...
                            </div>
                          : salons.length === 0 ?
                            <div className="p-4 text-center text-vmb-text-muted">
                              No salons found
                            </div>
                          : salons.map((salon) => (
                              <div
                                key={salon._id}
                                onClick={() => {
                                  setValue("salonId", salon._id, {
                                    shouldValidate: true,
                                  });
                                  setValue("selectedServices", []);
                                  setSalonDropdownOpen(false);
                                  setSearchTerm("");
                                }}
                                className="px-4 py-3 hover:bg-vmb-bg-soft border-1  border-vmb-bg-soft cursor-pointer flex items-center gap-3"
                              >
                                <img
                                  src={salon.profilePic || SalonImage}
                                  alt={salon.salonName}
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                                <div>
                                  <p className="font-medium line-clamp-2">
                                    {salon.salonName}
                                  </p>
                                  <p className="text-xs text-vmb-text-muted">
                                    ({salon.distance})
                                  </p>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      )}
                      {errors.salonId && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.salonId.message}
                        </p>
                      )}
                    </div>

                    {selectedSalon && (
                      <div className="relative" ref={serviceDropdownRef}>
                        <label className="text-vmb-text-main text-[14px] font-medium">
                          Select Services
                        </label>
                        <div
                          onClick={() =>
                            setServiceDropdownOpen(!serviceDropdownOpen)
                          }
                          className="w-full mt-1 border border-vmb-primary/10 rounded-[8px] py-3 px-4 pr-10 text-sm flex justify-between items-center cursor-pointer bg-white min-h-[48px] flex-wrap gap-2"
                        >
                          {selectedServices.length > 0 ?
                            <div className="flex flex-wrap gap-2">
                              {selectedServices.map((name) => {
                                const svc = selectedSalon.services.find(
                                  (s) => s.serviceName === name,
                                );
                                return (
                                  <div
                                    key={name}
                                    className="flex items-center gap-2 bg-vmb-primary/50 text-white rounded-md px-3 py-1.5 text-xs"
                                  >
                                    <span>{name}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleService(name);
                                      }}
                                      className="w-5 h-5 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center"
                                    >
                                      ×
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          : <span className="text-vmb-text-muted/50">
                              Choose services...
                            </span>
                          }
                          <IoChevronDown
                            className={`text-vmb-primary transition-transform ${
                              serviceDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {serviceDropdownOpen && (
                          <div className="absolute top-full mt-2 w-full bg-white border border-vmb-primary/10 rounded-[8px] shadow-lg z-10 max-h-60 overflow-y-auto custom-scrollbar p-3">
                            {selectedSalon.services.length === 0 ?
                              <p className="text-center text-vmb-text-muted py-4">
                                No services available
                              </p>
                            : selectedSalon.services.map((svc) => (
                                <CustomCheckbox
                                  key={svc._id}
                                  label={`${svc.serviceName} (${formatDuration(
                                    svc.serviceDuration,
                                  )} min - $${svc.servicePrice})`}
                                  checked={selectedServices.includes(
                                    svc.serviceName,
                                  )}
                                  onChange={() =>
                                    toggleService(svc.serviceName)
                                  }
                                />
                              ))
                            }
                          </div>
                        )}
                        {errors.selectedServices && (
                          <p className="text-red-500 text-xs mt-1">
                            {hasServices ?
                              errors.selectedServices.message
                            : "No services available for this salon"}
                          </p>
                        )}
                      </div>
                    )}

                    {selectedServices.length > 0 && (
                      <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-md p-4 max-h-28 overflow-y-auto custom-scrollbar">
                        <div className=" grid grid-cols-3 gap-2 font-medium text-vmb-text-main  text-xs  mb-2 ">
                          <span>Service</span>
                          <span>Duration</span>
                          <span>Price</span>
                        </div>
                        {selectedServices.map((name) => {
                          const s = getServiceByName(name);
                          return (
                            <div
                              key={name}
                              className="border-b border-vmb-bg-soft py-2  grid grid-cols-3 gap-2  text-xs text-vmb-text-muted"
                            >
                              <span>{s?.serviceName}</span>
                              <span>{s?.serviceDuration} min</span>
                              <span>${s?.servicePrice}</span>
                            </div>
                          );
                        })}
                        <div className="flex flex-col items-end font-bold text-vmb-primary mt-3">
                          <p>Total: ${total.toFixed(2)}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-vmb-text-main text-[14px] font-medium">
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
                            className={`w-full border rounded-[8px] px-3 py-2 text-sm mt-1 focus:outline-none focus:border-vmb-secondary ${
                              errors.email ? "border-red-500" : (
                                "border-vmb-primary/10"
                              )
                            }`}
                          />
                        )}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-vmb-text-main text-[14px] font-medium">
                        Write a sweet message
                      </label>
                      <Controller
                        name="message"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <textarea
                            {...field}
                            value={value || ""}
                            rows={3}
                            placeholder="Type your message..."
                            onChange={(e) => {
                              let newValue = e.target.value;

                              if (newValue.startsWith(" ")) {
                                newValue = newValue.trimStart();
                              }

                              e.target.value = newValue;

                              onChange(newValue);
                            }}
                            className="w-full border border-vmb-primary/10 rounded-[8px] p-3 text-sm mt-1 resize-none focus:outline-none focus:border-vmb-secondary"
                          />
                        )}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <AppButton
                      type="submit"
                      variant="primary"
                      size="custom"
                      className="mt-6 py-2 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Requesting..." : "  Request Now"}
                    </AppButton>
                  </form>
                : <>
                    <Dialog.Title
                      as="h3"
                      className="text-center text-[22px] font-bold text-vmb-secondary"
                    >
                      {gift?.status === "accepted" ?
                        "Treat Confirmed!"
                      : "Treat Request Sent!"}
                    </Dialog.Title>

                    <p className="text-center text-vmb-text-muted text-[14px] mt-2">
                      {gift?.status === "accepted" ?
                        <>
                          Payment has been completed successfully.
                          <br />
                          The salon has been notified and your treat is
                          confirmed. Enjoy the experience!
                        </>
                      : <>
                          Your request has been shared successfully.
                          <br />
                          Wait for payment confirmation.
                          <br />
                          We’ve notified the user about your treat.
                          <br />
                          You’ll be updated soon.
                        </>
                      }
                    </p>

                    <div className="mt-6 border border-vmb-secondary bg-white rounded-[10px] p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            selectedSalon?.profilePic ||
                            gift?.salonId?.profilePic ||
                            SalonImage
                          }
                          alt={
                            selectedSalon?.salonName || gift?.salonId?.salonName
                          }
                          className="w-[60px] h-[60px] rounded-md object-cover border border-vmb-primary/10"
                        />
                        <div>
                          <p className="text-vmb-text-main font-semibold text-[18px]">
                            {selectedSalon?.salonName ||
                              gift?.salonId?.salonName}
                          </p>
                          <p className="text-vmb-text-muted text-[12px]">
                            {selectedSalon?.description ||
                              gift?.salonId?.description ||
                              ""}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 border border-vmb-primary/10 bg-vmb-bg-soft rounded-[5px] p-3 flex flex-col gap-2 max-h-28 overflow-y-auto custom-scrollbar">
                        <div className=" grid grid-cols-3 gap-2    mb-2   text-[12px] text-vmb-text-muted font-medium">
                          <span>Service:</span>
                          <span>Duration:</span>
                          <span>Price:</span>
                        </div>
                        {gift?.services ?
                          gift?.services?.map((svc, i) => (
                            <div
                              key={i}
                              className="border-b border-vmb-primary/5 py-2  grid grid-cols-3 gap-2  text-[12px] text-vmb-text-muted"
                            >
                              <span>{svc.serviceName}</span>
                              <span>{formatDuration(svc.serviceDuration)}</span>
                              <span>${svc.servicePrice}</span>
                            </div>
                          ))
                        : selectedSalon?.services
                            .filter((s) =>
                              selectedServices.includes(s.serviceName),
                            )
                            .map((svc, i) => (
                              <div
                                key={i}
                                className="border-b border-vmb-primary/5 py-2  grid grid-cols-3 gap-2  text-[12px] text-vmb-text-muted"
                              >
                                <span>{svc.serviceName}</span>
                                <span>
                                  {formatDuration(svc.serviceDuration)}
                                </span>
                                <span>${svc.servicePrice}</span>
                              </div>
                            ))
                        }
                      </div>

                      <div className="flex flex-col gap-3 mt-4">
                        <h4 className="text-vmb-primary font-bold text-[18px]">
                          Who’s treating you?
                        </h4>
                        {/* <label className="text-vmb-text-main text-[14px] mt-2 block">
                          Email
                        </label> */}
                        <input
                          type="email"
                          value={
                            submittedData?.email || gift?.receiverEmail || ""
                          }
                          readOnly
                          className="w-full border border-vmb-primary/10 bg-vmb-bg-soft rounded-[8px] px-3 py-2 text-sm text-vmb-text-muted/50 mt-1 cursor-not-allowed"
                        />
                        {/* <label className="text-vmb-text-main text-[14px] mt-3 block">
                          Write a sweet message
                        </label> */}
                        <textarea
                          rows={3}
                          value={submittedData?.message || gift?.message || ""}
                          readOnly
                          className="w-full border border-vmb-primary/10 bg-vmb-bg-soft rounded-[8px] p-3 text-sm text-vmb-text-muted/50 mt-1 resize-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <p className="text-left italic text-vmb-text-muted/50 text-[13px] mt-4">
                      Copy link to share this treat request.
                    </p>
                    <div className="mt-2 border border-vmb-primary/10 bg-white rounded-[10px] flex justify-between items-center px-3 py-2">
                      <span className="italic text-[14px] text-vmb-text-muted/50 truncate">
                        {import.meta.env.VITE_FRONTEND_URL + `gifts`}
                      </span>
                      <IoCopyOutline
                        onClick={() => {
                          if (copyToastId) {
                            toastDismiss(copyToastId);
                          }
                          navigator.clipboard.writeText(
                            import.meta.env.VITE_FRONTEND_URL + `gifts`,
                          );
                          const newToastId = toastSuccess("Link copied!");
                          setCopyToastId(newToastId);
                        }}
                        className="text-vmb-primary text-xl cursor-pointer"
                      />
                    </div>
                  </>
                }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
