import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useLayoutEffect, useEffect } from "react";
import { IoClose } from "react-icons/io5";

import {
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import salonIcon from "../../../../assets/salon-1.png";
import AppButton from "../../../common/site/AppButton";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { convertTo12Hour } from "../../../../utils/HelperFunctions";
import {
  useDeclineAppointmentMutation,
  useScheduleAppointmentMutation,
} from "../../../../store/api";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../../../utils/toast";
import TimePicker from "../../../common/site/TimePicker";
import ServicesTable from "../../../common/dashboard/ServicesTable";
export default function RescheduleAppointmentModal({
  isOpen,
  closeModal,
  initialData,
  onAccept,
}) {
  const scheduleSchema = z.object({
    appointmentDate: z.string().min(1, "Please select a date"),
    appointmentTime: z.string().min(1, "Please select a time"),
  });
  const appointmentId = initialData?.appointment?.id;
  const [declineAppointment, { isLoading: declining }] =
    useDeclineAppointmentMutation();
  const [scheduleAppointment, { isLoading: scheduling }] =
    useScheduleAppointmentMutation();
  const data = initialData || {
    salon: {
      name: "Luxe Beauty Salon",
      description: "Premium Beauty Services",
      image: salonIcon,
    },
    treatTo: {
      name: "Sarah Johnson",
      email: "sarah@gmail.com",
      phone: "+14 256 365470",
      image: salonIcon,
    },
    treatBy: {
      name: "Jane Doe",
      email: "jane_stylist@gmail.com",
      phone: "+14 785 456789",
      image: salonIcon,
    },
    services: [
      { name: "Haircut & Styling", duration: "1 Hr", price: 50 },
      { name: "HydraFacial", duration: "1.5 Hr", price: 120 },
    ],
    appointment: {
      date: "04-08-2025",
      time: "11:00 AM",
      message:
        "I’d like to reschedule my booking. Please update the appointment time as per the new availability. 5pm on Wednesday 15 Oct, 2025",
    },
  };
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    mode: "onChange",
    defaultValues: {
      appointmentDate: "",
      appointmentTime: "",
    },
  });
  const [step, setStep] = useState(1);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const services =
    Array.isArray(data?.services) ? data.services
    : data?.services ? [data.services]
    : [];

  const totalPrice = services.reduce((s, it) => s + (it.price || 0), 0);
  const type = data?.appointment?.type;
  let finalTotal;

  if (type === "invite") {
    finalTotal = totalPrice;
  } else if (type === "booking") {
    finalTotal = totalPrice + 2.5;
  } else if (type === "gift") {
    finalTotal = totalPrice + totalPrice * 0.1;
  } else {
    finalTotal = totalPrice;
  }
  const containerRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      const active = step === 1 ? step1Ref.current : step2Ref.current;
      if (!active) return;
      const height = active.offsetHeight;
      containerRef.current.style.height = `${height}px`;
    };

    updateHeight();

    let ro;
    try {
      ro = new ResizeObserver(updateHeight);
      if (step1Ref.current) ro.observe(step1Ref.current);
      if (step2Ref.current) ro.observe(step2Ref.current);
    } catch (err) {
      window.addEventListener("resize", updateHeight);
    }

    const imgs = containerRef.current.querySelectorAll("img");
    imgs.forEach((img) => img.addEventListener("load", updateHeight));

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", updateHeight);
      imgs.forEach((img) => img.removeEventListener("load", updateHeight));
    };
  }, [step]);
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  const onAcceptAndSchedule = () => setStep(2);
  const handleDecline = async () => {
    if (!appointmentId) return toastError("Appointment not found");

    const loadingToast = toastLoading("Declining appointment...");
    try {
      await declineAppointment(appointmentId).unwrap();
      toastDismiss(loadingToast);
      toastSuccess("Appointment declined");
      closeModal();
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to decline appointment");
    }
  };
  const onScheduleNow = async (formData) => {
    if (!appointmentId) return toastError("Appointment not found");

    const loadingToast = toastLoading("Scheduling appointment...");
    try {
      await scheduleAppointment({
        id: appointmentId,
        data: {
          appointmentDate: formData?.appointmentDate,
          startTime: convertTo12Hour(formData?.appointmentTime),
        },
      }).unwrap();

      toastDismiss(loadingToast);
      toastSuccess("Appointment scheduled successfully!");
      closeModal();
      onAccept?.();
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to schedule appointment");
    }
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-poppins"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-[450px] transform overflow-hidden rounded-[20px] border border-vmb-primary/10 bg-vmb-bg-soft p-[30px] shadow-xl transition-all">
                  <IoClose
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-vmb-primary text-2xl cursor-pointer"
                  />

                  <div
                    ref={containerRef}
                    className="relative w-full overflow-hidden transition-all duration-300 ease-in-out"
                  >
                    <div
                      className={`flex w-[200%] transition-transform duration-300 ${
                        step === 2 ? "-translate-x-1/2" : "translate-x-0"
                      } items-start`}
                    >
                      <div ref={step1Ref} className="w-1/2 p-0 px-0">
                        <h2 className="text-vmb-primary text-center font-bold text-[22px] mb-4">
                          Reschedule Request
                        </h2>

                        <div className="bg-vmb-bg-soft border border-vmb-primary/10 rounded-[10px] p-[20px] flex flex-col gap-[20px]">
                          <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-3 flex flex-col gap-4">
                            <div>
                              <p className="text-vmb-primary font-medium text-[14px] mb-2">
                                Treat To:
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                <img
                                  src={data.treatTo?.image}
                                  className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0 border border-vmb-primary/10"
                                />
                                <div>
                                  <p className="font-semibold text-[14px] text-vmb-text-muted">
                                    {data.treatTo?.name}
                                  </p>
                                  <p className="text-[12px] text-vmb-text-muted">
                                    {data.treatTo?.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className="text-vmb-primary font-medium text-[14px] mb-2">
                                Treat By:
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                <img
                                  src={data.treatBy?.image}
                                  className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0 border border-vmb-primary/10"
                                />
                                <div>
                                  <p className="font-semibold text-[14px] text-vmb-primary">
                                    {data.treatBy?.name}
                                  </p>
                                  <p className="text-[12px] text-vmb-text-muted">
                                    {data.treatBy?.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-[10px] flex flex-col gap-[20px]">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                              <p className="text-vmb-primary font-medium text-[14px]">
                                Previous Appointment Details
                              </p>

                              {dropdownOpen ?
                                <FaChevronUp className="text-vmb-primary" />
                              : <FaChevronDown className="text-vmb-primary" />}
                            </div>

                            {dropdownOpen && (
                              <div className="flex flex-col gap-[20px] overflow-hidden animate-fadeIn">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-[14px] font-medium text-vmb-text-main block mb-2">
                                      Date
                                    </label>
                                    <div className="flex items-center gap-2 border border-vmb-primary/10 bg-white rounded-[8px] p-3">
                                      <FaCalendarAlt className="text-vmb-primary" />
                                      <span className="text-[14px] text-vmb-text-main">
                                        {data?.appointment?.date || "N/A"}
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[14px] font-medium text-vmb-text-main block mb-2">
                                      Time
                                    </label>
                                    <div className="flex items-center gap-2 border border-vmb-primary/10 bg-white rounded-[8px] p-3">
                                      <FaClock className="text-vmb-primary" />
                                      <span className="text-[14px] text-vmb-text-main">
                                        {data?.appointment?.time || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-[10px] flex flex-col gap-[10px]">
                            <p className="text-vmb-primary font-medium text-[14px]">
                              Reason for Rescheduling
                            </p>

                            <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-[8px] p-[12px]">
                              <p className="text-[12px] italic text-vmb-text-muted leading-[18px]">
                                {data?.appointment?.message ||
                                  "No reason provided."}
                              </p>
                            </div>
                          </div>

                          <div className="border border-vmb-primary/10 rounded-[10px] p-[10px] flex flex-col gap-[10px]">
                            <p className="text-vmb-primary text-[14px] font-medium">
                              Services:
                            </p>
                            <ServicesTable
                              services={data?.services}
                              containerClass="border border-vmb-primary/10 rounded-[10px] p-2 sm:p-3 text-[11px] sm:text-[12px]"
                              scrollbarClass="custom-scrollbar"
                              maxHeightClass="max-h-32"
                              headerClass="px-1"
                              rowClass="border-t border-vmb-primary/10 pt-2 text-vmb-primary text-[11px] sm:text-[12px]"
                            />

                            <div className="flex justify-end">
                              <p className="text-vmb-secondary font-bold text-[13px]">
                                Amount Paid: ${finalTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex  flex-col  sm:flex-row justify-between gap-4 mt-4">
                          <div className="w-full sm:w-[40%]">
                            {/* <AppButton
                              leftIcon={<FaTimes />}
                              variant="primary"
                              onClick={closeModal}
                            >
                              Decline
                            </AppButton> */}
                            <AppButton
                              leftIcon={<FaTimes />}
                              variant="primary"
                              onClick={handleDecline}
                              disabled={declining}
                            >
                              {declining ? "Declining..." : "Decline"}
                            </AppButton>
                          </div>
                          <div className="w-full sm:w-[60%]">
                            <AppButton
                              leftIcon={<FaCheck />}
                              variant="outline-dark"
                              onClick={onAcceptAndSchedule}
                            >
                              Accept & Reschedule
                            </AppButton>
                          </div>
                        </div>
                      </div>

                      <div ref={step2Ref} className="w-1/2 p-0 px-0">
                        <h2 className="text-vmb-primary text-center font-bold text-[22px] mb-4">
                          Reschedule Appointment
                        </h2>

                        <form
                          onSubmit={handleSubmit(onScheduleNow)}
                          className="bg-white/50 border border-vmb-primary/10 overflow-y-auto custom-scrollbar rounded-[10px] p-[20px] flex flex-col gap-[20px]"
                        >
                          <div className="border border-vmb-primary/10 rounded-[10px] p-[10px] flex flex-col gap-[10px]">
                            <p className="text-vmb-primary text-[14px] font-medium">
                              Services:
                            </p>
                            <ServicesTable
                              services={data?.services}
                              containerClass="border border-vmb-primary/10 rounded-[10px] p-2 sm:p-3 text-[11px] sm:text-[12px]"
                              scrollbarClass="custom-scrollbar"
                              maxHeightClass="max-h-32"
                              headerClass="px-1"
                              rowClass="border-t border-vmb-primary/10 pt-2 text-vmb-primary text-[11px] sm:text-[12px]"
                            />

                            <div className="flex justify-end">
                              <p className="text-vmb-secondary font-bold text-[13px]">
                                Amount Paid: ${finalTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-vmb-primary font-medium text-[14px] mb-2">
                              Choose schedule Date & Time
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[14px] font-medium text-vmb-text-main block mb-2">
                                  Date
                                </label>

                                <Controller
                                  name="appointmentDate"
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      type="date"
                                      min={
                                        new Date().toISOString().split("T")[0]
                                      }
                                      className={`w-full border rounded-[8px] p-3 ${
                                        errors.appointmentDate ?
                                          "border-red-500"
                                        : "border-vmb-primary/10"
                                      }`}
                                    />
                                  )}
                                />
                                {errors.appointmentDate && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.appointmentDate.message}
                                  </p>
                                )}
                              </div>
                              <TimePicker
                                label="Time"
                                name="appointmentTime"
                                control={control}
                              />
                              {/* <div>
                                <label className="text-[14px] font-medium text-[#404040] block mb-2">
                                  Time
                                </label>

                                <Controller
                                  name="appointmentTime"
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      type="time"
                                      className={`w-full border rounded-[8px] p-3 ${
                                        errors.appointmentTime
                                          ? "border-red-500"
                                          : "border-[#E5E5E5]"
                                      }`}
                                    />
                                  )}
                                />
                                {errors.appointmentTime && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.appointmentTime.message}
                                  </p>
                                )}
                              </div> */}
                            </div>
                          </div>
                          {/* </div> */}

                          <div className="flex items-center gap-3 mt-4">
                            <AppButton
                              type="submit"
                              variant="primary"
                              size="custom"
                              className="text-[16px] font-medium py-2"
                              disabled={!isValid || scheduling}
                            >
                              {scheduling ? "Scheduling..." : "Schedule Now"}
                            </AppButton>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
