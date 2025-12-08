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

const createSchema = (hasServices) =>
  z.object({
    salonId: z.string().min(1, "Please select a salon"),
    selectedServices: z
      .array(z.string())
      .min(
        1,
        hasServices
          ? "Please select at least one service"
          : "No services available"
      ),
    email: z.string().email("Please enter a valid email"),
    message: z
      .string()
      .min(5, "Message must be at least 5 characters")
      .optional(),
  });

export default function TreatModal({ isOpen, closeModal, initialData }) {
  const gift = initialData?.gift;

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
      message: "",
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
        message: "",
      });
      setIsSubmitted(false);
      setSubmittedData(null);
    }
  }, [isOpen, gift, reset]);
  const getServiceByName = (name) =>
    selectedSalon?.services?.find((s) => s.serviceName === name);
  const totalPrice = selectedServices.reduce((sum, name) => {
    const svc = getServiceByName(name);
    return sum + (svc ? Number(svc.servicePrice) : 0);
  }, 0);
  const toggleService = (serviceName) => {
    const updated = selectedServices.includes(serviceName)
      ? selectedServices.filter((s) => s !== serviceName)
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
        className="relative z-50 font-[Poppins]"
        onClose={closeModal}
      >
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child as={Fragment}>
              <Dialog.Panel className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-xl transition-all">
                <IoClose
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer"
                />

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-[#581838] font-bold text-[24px]">
                        Treat Me, Baby!
                      </h3>
                      <p className="text-[#00000080] italic text-[14px] mt-1">
                        Get pampered — request a treat from someone you love!
                      </p>
                    </div>

                    <div className="relative" ref={salonDropdownRef}>
                      <label className="text-[#404040] text-[14px] font-medium">
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
                            className="w-full mt-1 border border-[#E5E5E5] rounded-[8px] py-3 px-4 pr-10 text-sm flex justify-between items-center cursor-pointer bg-white"
                          >
                            <span
                              className={
                                field.value ? "text-black" : "text-[#00000080]"
                              }
                            >
                              {field.value
                                ? salons.find((s) => s._id === field.value)
                                    ?.salonName || "Select salon"
                                : "Find your salon.."}
                            </span>
                            <IoChevronDown
                              className={`text-[#581838] transition-transform ${
                                salonDropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        )}
                      />
                      {salonDropdownOpen && (
                        <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E5E5] rounded-[8px] shadow-lg z-10 max-h-60 overflow-y-auto">
                          <input
                            type="text"
                            placeholder="Search salons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border-b border-[#E5E5E5] focus:outline-none"
                            autoFocus
                          />
                          {loadingSalons ? (
                            <div className="p-4 text-center text-gray-500">
                              Loading...
                            </div>
                          ) : salons.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              No salons found
                            </div>
                          ) : (
                            salons.map((salon) => (
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
                                className="px-4 py-3 hover:bg-[#FFF4F6] cursor-pointer flex items-center gap-3"
                              >
                                <img
                                  src={salon.profilePic || "/default-salon.jpg"}
                                  alt={salon.salonName}
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                                <div>
                                  <p className="font-medium">
                                    {salon.salonName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {salon.description}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
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
                        <label className="text-[#404040] text-[14px] font-medium">
                          Select Services
                        </label>
                        <div
                          onClick={() =>
                            setServiceDropdownOpen(!serviceDropdownOpen)
                          }
                          className="w-full mt-1 border border-[#E5E5E5] rounded-[8px] py-3 px-4 pr-10 text-sm flex justify-between items-center cursor-pointer bg-white min-h-[48px] flex-wrap gap-2"
                        >
                          {selectedServices.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedServices.map((name) => {
                                const svc = selectedSalon.services.find(
                                  (s) => s.serviceName === name
                                );
                                return (
                                  <div
                                    key={name}
                                    className="flex items-center gap-2 bg-[#64748B] text-white rounded-md px-3 py-1.5 text-xs"
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
                          ) : (
                            <span className="text-[#00000080]">
                              Choose services...
                            </span>
                          )}
                          <IoChevronDown
                            className={`text-[#581838] transition-transform ${
                              serviceDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {serviceDropdownOpen && (
                          <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E5E5] rounded-[8px] shadow-lg z-10 max-h-60 overflow-y-auto p-3">
                            {selectedSalon.services.length === 0 ? (
                              <p className="text-center text-gray-500 py-4">
                                No services available
                              </p>
                            ) : (
                              selectedSalon.services.map((svc) => (
                                <CustomCheckbox
                                  key={svc._id}
                                  label={`${svc.serviceName} (${formatDuration(
                                    svc.serviceDuration
                                  )} min - $${svc.servicePrice})`}
                                  checked={selectedServices.includes(
                                    svc.serviceName
                                  )}
                                  onChange={() =>
                                    toggleService(svc.serviceName)
                                  }
                                />
                              ))
                            )}
                          </div>
                        )}
                        {errors.selectedServices && (
                          <p className="text-red-500 text-xs mt-1">
                            {hasServices
                              ? errors.selectedServices.message
                              : "No services available for this salon"}
                          </p>
                        )}
                      </div>
                    )}

                    {selectedServices.length > 0 && (
                      <div className="border border-[#5818381A] bg-[#F2F2F2] rounded-md p-4">
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
                      <label className="text-[#404040] text-[14px] font-medium">
                        Email
                      </label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="email"
                            placeholder="Enter email..."
                            className={`w-full border rounded-[8px] px-3 py-2 text-sm mt-1 focus:outline-none focus:border-[#FF92A5] ${
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
                    </div>

                    <div>
                      <label className="text-[#404040] text-[14px] font-medium">
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
                            className="w-full border border-[#E5E5E5] rounded-[8px] p-3 text-sm mt-1 resize-none focus:outline-none focus:border-[#FF92A5]"
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
                ) : (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-center text-[22px] font-bold text-[#FF92A5]"
                    >
                      Treat Request Sent!
                    </Dialog.Title>
                    <p className="text-center text-[#00000080] text-[14px] mt-2">
                      Your request has been shared successfully.
                      <br /> Wait for payment confirmation.
                      <br /> We’ve notified the user about your treat. <br />
                      You’ll be updated soon.
                    </p>

                    <div className="mt-6 border border-[#FF92A5] bg-white rounded-[10px] p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            selectedSalon?.profilePic ||
                            gift?.salonId?.profilePic ||
                            "/default-salon.jpg"
                          }
                          alt={
                            selectedSalon?.salonName || gift?.salonId?.salonName
                          }
                          className="w-[60px] h-[60px] rounded-md object-cover border border-gray-200"
                        />
                        <div>
                          <p className="text-[#4B5563] font-semibold text-[18px]">
                            {selectedSalon?.salonName ||
                              gift?.salonId?.salonName}
                          </p>
                          <p className="text-[#4B5563] text-[12px]">
                            {selectedSalon?.description ||
                              gift?.salonId?.description ||
                              ""}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 border border-[#5818381A] bg-[#F2F2F2] rounded-[5px] p-3 flex flex-col gap-2">
                        <div className="flex justify-between text-[12px] text-[#4B5563] font-medium">
                          <span>Service:</span>
                          <span>Duration:</span>
                          <span>Price:</span>
                        </div>
                        {gift?.services
                          ? gift?.services?.map((svc, i) => (
                              <div
                                key={i}
                                className="border-t border-[#D9D9D9] pt-2 flex justify-between text-[12px] text-[#4B5563]"
                              >
                                <span>{svc.serviceName}</span>
                                <span>
                                  {formatDuration(svc.serviceDuration)}
                                </span>
                                <span>${svc.servicePrice}</span>
                              </div>
                            ))
                          : selectedSalon?.services
                              .filter((s) =>
                                selectedServices.includes(s.serviceName)
                              )
                              .map((svc, i) => (
                                <div
                                  key={i}
                                  className="border-t border-[#D9D9D9] pt-2 flex justify-between text-[12px] text-[#4B5563]"
                                >
                                  <span>{svc.serviceName}</span>
                                  <span>
                                    {formatDuration(svc.serviceDuration)}
                                  </span>
                                  <span>${svc.servicePrice}</span>
                                </div>
                              ))}
                      </div>

                      <div className="mt-4">
                        <h4 className="text-[#581838] font-bold text-[18px]">
                          Who’s treating you?
                        </h4>
                        <label className="text-[#404040] text-[14px] mt-2 block">
                          Email
                        </label>
                        <input
                          type="email"
                          value={
                            submittedData?.email || gift?.receiverEmail || ""
                          }
                          readOnly
                          className="w-full border border-[#E5E5E5] bg-[#F9FAFB] rounded-[8px] px-3 py-2 text-sm text-[#00000080] mt-1 cursor-not-allowed"
                        />
                        <label className="text-[#404040] text-[14px] mt-3 block">
                          Write a sweet message
                        </label>
                        <textarea
                          rows={3}
                          value={submittedData?.message || gift?.message || ""}
                          readOnly
                          className="w-full border border-[#E5E5E5] bg-[#F9FAFB] rounded-[8px] p-3 text-sm text-[#00000080] mt-1 resize-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <p className="text-center italic text-[#00000080] text-[13px] mt-4">
                      Copy link to share this treat request.
                    </p>
                    <div className="mt-2 border border-[#0000001A] rounded-[10px] flex justify-between items-center px-3 py-2">
                      <span className="italic text-[14px] text-[#00000080] truncate">
                        https://yourdomain.com/gift/{gift?._id || "new-request"}
                      </span>
                      <IoCopyOutline
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://yourdomain.com/gift/${
                              gift?._id || "new-request"
                            }`
                          );
                        }}
                        className="text-[#581838] text-xl cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
