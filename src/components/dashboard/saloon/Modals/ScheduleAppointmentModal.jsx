import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useLayoutEffect, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaCheck, FaTimes } from "react-icons/fa";
import salonIcon from "../../../../assets/salon-1.png";
import AppButton from "../../../common/site/AppButton";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { convertTo12Hour } from "../../../../utils/HelperFunctions";
export default function ScheduleAppointmentModal({
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
  };

  const [step, setStep] = useState(1);

  const totalPrice = (data?.services || []).reduce(
    (s, it) => s + (it.price || 0),
    0
  );

  const containerRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
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
  const onBack = () => setStep(1);
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
          appointmentDate: formData.appointmentDate,
          startTime: convertTo12Hour(formData.appointmentTime),
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
          className="relative z-50 font-[Poppins]"
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
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
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
                <Dialog.Panel className="relative w-full max-w-[450px] transform overflow-hidden rounded-[20px] border border-[#5818381A] bg-[#FFF2F4] p-[30px] shadow-xl transition-all">
                  <IoClose
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer"
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
                        <h2 className="text-[#581838] text-center font-bold text-[22px] mb-4">
                          Schedule Appointment
                        </h2>

                        <div className="bg-white border border-[#0000001A] rounded-[10px] p-[20px] flex flex-col gap-[20px]">
                          <div className="border border-[#0000001A] bg-[#F0F0F0] rounded-[10px] p-3 flex flex-col gap-4">
                            <div>
                              <p className="text-[#581838] font-medium text-[14px] mb-2">
                                Treat To:
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                {/* <img
                                  src={data.treatTo?.image}
                                  className="w-[53px] h-[53px] rounded-full object-cover"
                                /> */}
                                <div>
                                  <p className="font-semibold text-[14px] text-[#4B5563]">
                                    {data.treatTo?.name}
                                  </p>
                                  <p className="text-[12px] text-[#4B5563]">
                                    {data.treatTo?.email}
                                  </p>
                                  {/* <p className="text-[12px] text-[#4B5563]">
                                    {data.treatTo?.phone}
                                  </p> */}
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className="text-[#581838] font-medium text-[14px] mb-2">
                                Treat By:
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                {/* <img
                                  src={data.treatBy?.image}
                                  className="w-[53px] h-[53px] rounded-full object-cover"
                                /> */}
                                <div>
                                  <p className="font-semibold text-[14px] text-[#581838]">
                                    {data.treatBy?.name}
                                  </p>
                                  <p className="text-[12px] text-[#4B5563]">
                                    {data.treatBy?.email}
                                  </p>
                                  {/* <p className="text-[12px] text-[#4B5563]">
                                    {data.treatBy?.phone}
                                  </p> */}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[10px]">
                            <p className="text-[#581838] text-[14px] font-medium">
                              Services:
                            </p>

                            <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[12px]">
                              <div className="flex justify-between text-[12px] font-medium text-black">
                                <span>Service</span>
                                <div className="flex gap-8">
                                  <span>Duration</span>
                                  <span>Price</span>
                                </div>
                              </div>

                              {data?.services?.length > 0 &&
                                data.services.map((srv, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-[12px] text-[#581838] border-t border-[#9CA3AF4D] pt-2"
                                  >
                                    <span>{srv.name}</span>
                                    <div className="flex gap-8">
                                      <span>{srv.duration}</span>
                                      <span>${srv.price}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>

                            <div className="flex justify-end">
                              <p className="text-[#FF92A5] font-bold text-[13px]">
                                Amount Paid: ${totalPrice}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                          <AppButton
                            leftIcon={<FaTimes />}
                            variant="primary"
                            onClick={handleDecline}
                            className="flex-1"
                            disabled={declining}
                          >
                            {declining ? "Declining..." : "Decline"}
                          </AppButton>
                          <AppButton
                            leftIcon={<FaCheck />}
                            variant="outline-dark"
                            onClick={onAcceptAndSchedule}
                            className="flex-1"
                          >
                            Accept & Schedule
                          </AppButton>
                        </div>
                      </div>

                      <div ref={step2Ref} className="w-1/2 p-0 px-0">
                        <h2 className="text-[#581838] text-center font-bold text-[22px] mb-4">
                          Schedule Appointment
                        </h2>

                        {/* <div className="bg-white border border-[#0000001A] rounded-[10px] p-[20px] flex flex-col gap-[20px]"> */}
                        <form
                          onSubmit={handleSubmit(onScheduleNow)}
                          className="bg-white border border-[#0000001A] rounded-[10px] p-[20px] flex flex-col gap-[20px]"
                        >
                          <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[10px]">
                            <p className="text-[#581838] text-[14px] font-medium">
                              Services:
                            </p>

                            <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[12px]">
                              <div className="flex justify-between text-[12px] font-medium text-black">
                                <span>Service</span>
                                <div className="flex gap-8">
                                  <span>Duration</span>
                                  <span>Price</span>
                                </div>
                              </div>

                              {data?.services?.length > 0 &&
                                data.services.map((srv, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-[12px] text-[#581838] border-t border-[#9CA3AF4D] pt-2"
                                  >
                                    <span>{srv.name}</span>
                                    <div className="flex gap-8">
                                      <span>{srv.duration}</span>
                                      <span>${srv.price}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>

                            <div className="flex justify-end">
                              <p className="text-[#FF92A5] font-bold text-[13px]">
                                Amount Paid: ${totalPrice}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-[#581838] font-medium text-[14px] mb-2">
                              Choose schedule Date & Time
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[14px] font-medium text-[#404040] block mb-2">
                                  Date
                                </label>
                                {/* <input
                                  type="date"
                                  className="w-full border border-[#E5E5E5] bg-white rounded-[8px] p-3"
                                /> */}
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
                                        errors.appointmentDate
                                          ? "border-red-500"
                                          : "border-[#E5E5E5]"
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

                              <div>
                                <label className="text-[14px] font-medium text-[#404040] block mb-2">
                                  Time
                                </label>
                                {/* <input
                                  type="time"
                                  className="w-full border border-[#E5E5E5] bg-white rounded-[8px] p-3"
                                /> */}
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
                              </div>
                            </div>
                          </div>
                          {/* </div> */}

                          <div className="flex items-center gap-3 mt-4">
                            <button
                              type="button"
                              onClick={onBack}
                              className="flex items-center cursor-pointer"
                            >
                              <span className="flex items-center justify-center min-w-8 h-8 rounded-xl bg-[#4b0d23] mr-2">
                                <FaArrowLeftLong className="text-pink-400" />
                              </span>
                              <span className="text-[#581838] font-medium">
                                Back
                              </span>
                            </button>

                            <AppButton
                              type="submit"
                              variant="primary"
                              size="custom"
                              // onClick={onScheduleNow}
                              disabled={!isValid || scheduling}
                              className="text-[16px] font-medium py-2"
                            >
                              {scheduling ? "Scheduling..." : "Schedule Now"}
                            </AppButton>
                          </div>
                        </form>
                        {/* </div> */}
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
