import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AppButton from "../../../common/site/AppButton";
import CustomCheckbox from "../../../common/site/CustomCheckbox";
import successGif from "../../../../assets/successGif.gif";
import {
  useCreateCheckoutSessionMutation,
} from "../../../../store/api";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../../../utils/toast";
import { convertTo12Hour } from "../../../../utils/HelperFunctions";
import { FaCalendar, FaClock } from "react-icons/fa";
import { useUser } from "../../../../hooks/useUser";
import TimePicker from "../../../common/site/TimePicker";

const bookingSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required")
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid name"),
  selectedServices: z
    .array(z.string())
    .min(1, "Please select at least one service"),
  appointmentDate: z
    .string()
    .min(1, "Please select a date")
    .refine(
      (date) => date && new Date(date) >= new Date().setHours(0, 0, 0, 0),
      {
        message: "Date cannot be in the past",
      }
    ),
  appointmentTime: z
    .string()
    .min(1, "Please select a time")
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
});

export default function BookAppointmentModal({
  isOpen,
  closeModal,
  initialData = {},
}) {
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const salon = initialData?.salon;
  const prefilledService = initialData?.service;
  const {user}=useUser();
  const [createCheckoutSession, { isLoading: isRedirecting }] =
    useCreateCheckoutSessionMutation();
  // const [createAppointment, { isLoading: booking }] =
  //   useCreateAppointmentMutation();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      selectedServices: [],
      appointmentDate: "",
      appointmentTime: "",
    },
  });

  const selectedServices = watch("selectedServices") || [];
useEffect(() => {
  const handleClickOutside = (event) => {
  
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  useEffect(() => {
    if (isOpen && salon) {
      const prefilledServiceName = prefilledService?.serviceName;
      const defaultServices = prefilledServiceName
        ? [prefilledServiceName]
        : [];

      reset({
        fullName: "",
        selectedServices: defaultServices,
        appointmentDate: "",
        appointmentTime: "",
      });
    }
  }, [isOpen, salon, prefilledService, reset]);

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
  const total = totalPrice + 2.5;
  const handleConfirm = async (data) => {
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
      clientName: data.fullName,
      appointmentDate: data?.appointmentDate,
      startTime: convertTo12Hour(data?.appointmentTime),
      paymentAmount: total,
      paymentType:"booking",
      requesterEmail:user?.email
    };
    const loadingToast = toastLoading("Creating your appointment...");
    try {
      const response = await createCheckoutSession(payload).unwrap();

      toastDismiss(loadingToast);

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toastError("Failed to initialize payment");
      }
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Payment failed. Please try again.");
      console.error("Checkout error:", err);
    }
  };

  return (
    <>
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
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <Transition.Child as={Fragment}>
                <Dialog.Panel className="relative w-full max-w-[420px] rounded-[10px] bg-white p-10 shadow-xl flex flex-col gap-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-[#581838] font-bold text-[24px]">
                      Book Your Appointment
                    </h2>
                    <IoClose
                      className="text-[#581838] text-2xl cursor-pointer"
                      onClick={closeModal}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={
                        salon?.profilePic ||
                        salon?.salonPhotos?.[0] ||
                        "/default-salon.jpg"
                      }
                      alt={salon?.salonName}
                      className="w-[60px] h-[60px] rounded-md object-cover"
                    />
                    <div>
                      <p className="text-[#4B5563] font-semibold text-[20px]">
                        {salon?.salonName}
                      </p>
                      <p className="text-[#4B5563] text-[12px]">
                        {salon?.description || "Premium Beauty Services"}
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit(handleConfirm)}
                    className="space-y-6"
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-[#404040] text-[14px] font-medium">
                        Full Name
                      </label>
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                          <input
                            {...field}
                            value={value || ""}
                            onChange={(e) => {
                              let newValue = e.target.value;

                              if (newValue.startsWith(" ")) {
                                newValue = newValue.trimStart();
                              }

                              e.target.value = newValue;

                              onChange(newValue);
                            }}
                            type="text"
                            placeholder="Enter your full name"
                            className={`border rounded-[8px] px-3 py-3 text-[16px] focus:outline-none focus:border-[#FF92A5] ${
                              errors.fullName
                                ? "border-red-500"
                                : "border-[#E5E5E5]"
                            }`}
                          />
                        )}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[#404040] text-[14px] font-medium">
                        Select Services
                      </label>
                      <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full border border-[#E5E5E5] rounded-[8px] py-2 px-3 pr-8 text-sm text-[#00000080] flex justify-between items-center cursor-pointer mt-1 flex-wrap gap-2 min-h-[42px]  max-h-28 overflow-y-auto custom-scrollbar"
                      >
                        {selectedServices.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedServices.map((srv) => (
                              <div
                                key={srv}
                                className="flex items-center gap-2 bg-[#64748B] text-white rounded-md px-3 py-[6px] text-[13px]"
                              >
                                <span>{srv}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleService(srv);
                                  }}
                                  className="flex items-center justify-center w-5 h-5 rounded-full bg-white/30 hover:bg-white/50 text-white"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span>Choose services...</span>
                        )}
                        <IoChevronDown
                          className={`ml-auto text-[#581838] transition-transform ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {dropdownOpen && salon?.services && (
                        <div
                          ref={dropdownRef}
                          className="absolute top-full mt-2 w-full bg-white border border-[#E5E5E5] rounded-[8px] shadow-md z-10 p-3 max-h-[180px] overflow-y-auto custom-scrollbar"
                        >
                          {salon.services.map((s) => (
                            <CustomCheckbox
                              key={s._id}
                              label={`${s.serviceName} (${s.serviceDuration} min - $${s.servicePrice})`}
                              checked={selectedServices.includes(s.serviceName)}
                              onChange={() => toggleService(s.serviceName)}
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
                      <div className="border border-[#5818381A] bg-[#F2F2F2] rounded-md p-4  max-h-32 overflow-y-auto custom-scrollbar">
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
                          Total: ${total.toFixed(2)}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-[#404040] text-[14px] font-semibold mb-1">
                          Booking Date
                        </label>
                        <Controller
                          name="appointmentDate"
                          control={control}
                          render={({ field }) => (
                            <div className="relative">
                              <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] pointer-events-none z-10" />

                              <input
                                type="date"
                                {...field}
                                min={new Date().toISOString().split("T")[0]}
                                className={`w-full bg-white border border-gray-300 text-[14px] rounded-md py-3 pl-10 pr-4 text-gray-700
                   focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-[#FF92A5]
                   transition-all cursor-pointer
                   [&::-webkit-calendar-picker-indicator]:opacity-0
                   [&::-webkit-calendar-picker-indicator]:absolute
                   [&::-webkit-calendar-picker-indicator]:right-0
                   [&::-webkit-calendar-picker-indicator]:w-full
                   [&::-webkit-calendar-picker-indicator]:h-full`}
                                style={{ appearance: "none" }}
                              />
                            </div>
                          )}
                        />
                        {errors.appointmentDate && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.appointmentDate.message}
                          </p>
                        )}
                      </div>
<TimePicker
  label="Booking Time"
  name="appointmentTime"
  control={control}
/>

                      {/* <div className="flex flex-col gap-2">
                        <label className="text-[#404040] text-[14px] font-medium">
                          Booking Time
                        </label>
                        <Controller
                          name="appointmentTime"
                          control={control}
                          render={({ field }) => (
                            <div className="relative">
                              <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF92A5] pointer-events-none z-10" />

                              <input
                                type="time"
                                {...field}
                                className={`w-full bg-white border border-gray-300 text-[14px] rounded-md py-3 pl-10 pr-4 text-gray-700
                   focus:outline-none focus:ring-2 focus:ring-[#FF92A5] focus:border-[#FF92A5]
                   transition-all cursor-pointer
                   [&::-webkit-calendar-picker-indicator]:opacity-0
                   [&::-webkit-calendar-picker-indicator]:absolute
                   [&::-webkit-calendar-picker-indicator]:right-0
                   [&::-webkit-calendar-picker-indicator]:w-full
                   [&::-webkit-calendar-picker-indicator]:h-full`}
                                style={{ appearance: "none" }}
                              />
                            </div>
                          )}
                        />
                        {errors.appointmentTime && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.appointmentTime.message}
                          </p>
                        )}
                      </div> */}
                    </div>

                    <AppButton
                      type="submit"
                      variant="primary"
                      size="custom"
                      // disabled={!isValid || booking}
                      disabled={!isValid || isRedirecting}
                      className="text-[16px] py-3 w-full"
                    >
                      {/* {booking ? "Booking..." : "Confirm & Pay"} */}
                      {isRedirecting ? "Redirecting..." : "Confirm & Pay"}
                    </AppButton>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={showSuccessModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-[Poppins]"
          onClose={() => setShowSuccessModal(false)}
        >
          <Transition.Child as={Fragment}>
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-[10px] p-[30px] flex flex-col items-center gap-[12px] w-full max-w-[420px] text-center shadow-lg">
              <img
                src={successGif}
                alt="Success"
                className="w-[138px] h-[138px]"
              />
              <h3 className="text-[#FF92A5] text-[20px] font-semibold">
                Thank you for your booking!
              </h3>
              <p className="text-[#404040] text-[14px] font-medium">
                We’ve shared your details with the salon — you’ll get a
                confirmation soon!
              </p>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
