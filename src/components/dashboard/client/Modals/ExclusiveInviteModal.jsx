import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import AppButton from "../../../common/site/AppButton";
import { FaCheck, FaTimes } from "react-icons/fa";
import {
  useAcceptInviteMutation,
  useGetSalonByIdQuery,
} from "../../../../store/api";
import { useDispatch } from "react-redux";
import { setSelectedSalon } from "../../../../store/features/selectedSalonSlice";
import { useNavigate } from "react-router-dom";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../../../utils/toast";
import { convertTo12Hour } from "../../../../utils/HelperFunctions";

export default function ExclusiveInviteModal({
  isOpen,
  closeModal,
  initialData = {},
}) {
  const [inviteOpen, setInviteOpen] = useState(isOpen);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [acceptInvite, { isLoading: accepting }] = useAcceptInviteMutation();
  const salon = initialData;
  const services = Array.isArray(salon?.services) ? salon.services : [];

  const discountPercent = salon?.discount || 0;
  const salonId = salon?.salonId;
  const inviteId = salon?.inviteId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("Salon Id==>", salonId);
  const {
    data: salonResponse,
    isLoading: loadingSalon,
    isSuccess,
  } = useGetSalonByIdQuery(salonId, {
    skip: !isOpen || !salonId,
  });
  useEffect(() => setInviteOpen(isOpen), [isOpen]);
  const handleViewSalon = () => {
    if (!salonId) return;

    if (isSuccess && salonResponse?.data) {
      dispatch(setSelectedSalon(salonResponse.data));
      closeModal();
      navigate(`/salon/${salonId}`);
      return;
    }

    if (loadingSalon) {
      toastLoading("Loading salon details...");
      return;
    }

    closeModal();
    navigate(`/salon/${salonId}`);
  };
  const closeAll = () => {
    setInviteOpen(false);
    setScheduleOpen(false);
    closeModal?.();
  };

  const subtotal = services.reduce((sum, s) => sum + s.price, 0);
  const discountValue = (subtotal * discountPercent) / 100;
  const finalPrice = subtotal - discountValue;

  const handleAccept = () => {
    setInviteOpen(false);
    setScheduleOpen(true);
  };

  // const handleConfirmBooking = () => {
  //   closeAll();
  //   initialData?.onBookingSuccess?.();
  // };
  const handleConfirmBooking = async () => {
    if (!inviteId) {
      toastError("Invite not found");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toastError("Please select date and time");
      return;
    }

    const loadingToast = toastLoading("Confirming your appointment...");

    try {
      await acceptInvite({
        id: inviteId,
        data: {
          appointmentDate: selectedDate,
          startTime: convertTo12Hour(selectedTime),
        },
      }).unwrap();

      toastDismiss(loadingToast);
      toastSuccess("Appointment booked successfully!");

      closeAll();
      initialData?.onBookingSuccess?.();
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to book appointment");
      console.error("Accept invite failed:", err);
    }
  };
  return (
    <>
      <Transition appear show={inviteOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-[Poppins]"
          onClose={closeAll}
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  style={{ background: "#FFF2F4" }}
                  className="relative w-full max-w-[480px] rounded-[20px]  p-[30px] shadow-xl flex flex-col gap-6"
                >
                  <IoClose
                    onClick={closeAll}
                    className="absolute top-6 right-6 text-[#581838] text-3xl cursor-pointer hover:opacity-80"
                  />

                  <div className="text-center">
                    <h3 className="text-[#FF92A5] font-bold text-[22px] leading-tight">
                      You’ve Got an Exclusive
                      <br />
                      Salon Invite!
                    </h3>
                    <p className="text-[#00000080] text-[14px] mt-3">
                      {salon?.name} has invited you to enjoy their services with
                      a special discount just for you. <br /> Review the offer
                      details below and confirm your booking to claim your
                      discount.
                    </p>
                  </div>

                  <div className="bg-white border border-[#0000001A] rounded-[10px] p-5 space-y-5">
                    <div className="flex items-center justify-between border border-[#9CA3AF4D] rounded-xl p-3">
                      <div className="flex items-center gap-4">
                        <img
                          src={salon?.image}
                          alt={salon?.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <div className="font-semibold text-[#4B5563]">
                            {salon?.name}
                          </div>
                          <div className="text-sm text-[#4B5563]">
                            {salon?.description}
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-xs px-3 py-1 bg-[#FF92A54D] text-[#581838] rounded cursor-pointer"
                        onClick={handleViewSalon}
                      >
                        View Salon
                      </button>
                    </div>

                    <div className="border border-[#9CA3AF4D] rounded-lg p-4 space-y-3">
                      <h4 className="font-medium text-[#581838]">
                        Exclusive Offer
                      </h4>
                      <div className="border border-[#9CA3AF4D] rounded-lg p-3 text-sm">
                        <div className="grid grid-cols-3 font-medium text-[#000]">
                          <div>Service</div>
                          <div>Duration</div>
                          <div>Price</div>
                        </div>
                        {services.map((s) => (
                          <div
                            key={s.name}
                            className="grid grid-cols-3 text-[#4B5563] mt-2"
                          >
                            <div>{s.name}</div>
                            <div>{s.duration} min</div>
                            <div>${s.price}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col items-end gap-1 text-[#FF92A5] font-bold text-sm">
                        <div>Discount: {discountPercent}%</div>
                        <div>
                          Price After Discount: ${finalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <AppButton
                      leftIcon={<FaTimes />}
                      variant="primary"
                      onClick={closeAll}
                      className="flex-1"
                    >
                      Maybe Later
                    </AppButton>
                    <AppButton
                      leftIcon={<FaCheck />}
                      variant="outline-dark"
                      onClick={handleAccept}
                      className="flex-1"
                    >
                      Accept & Book Now
                    </AppButton>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={scheduleOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-[Poppins]"
          onClose={closeAll}
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
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  style={{ background: "#FFF2F4" }}
                  className="relative w-full max-w-[480px] rounded-[20px]  p-[30px] shadow-xl flex flex-col gap-6"
                >
                  <IoClose
                    onClick={closeAll}
                    className="absolute top-6 right-6 text-[#581838] text-3xl cursor-pointer hover:opacity-80"
                  />

                  <div className="text-center mt-8">
                    <h3 className="text-[#FF92A5] font-bold text-[22px]">
                      Thank you for accepting the invite!
                    </h3>
                    <p className="text-[#00000080] text-[14px] mt-3">
                      Choose a suitable date and time to confirm your salon
                      appointment.
                    </p>
                  </div>

                  <div className="bg-white border border-[#0000001A] rounded-[10px] p-5 space-y-5">
                    <div className="border border-[#9CA3AF4D] rounded-lg p-4 space-y-3">
                      <h4 className="font-medium text-[#581838]">
                        Exclusive Offer
                      </h4>
                      <div className="border border-[#9CA3AF4D] rounded-lg p-3 text-sm">
                        <div className="grid grid-cols-3 font-medium text-[#000]">
                          <div>Service</div>
                          <div>Duration</div>
                          <div>Price</div>
                        </div>
                        {services.map((s) => (
                          <div
                            key={s.id}
                            className="grid grid-cols-3 text-[#4B5563] mt-2"
                          >
                            <div>{s.name}</div>
                            <div>{s.duration} min</div>
                            <div>${s.price}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col items-end gap-1 text-[#FF92A5] font-bold text-sm">
                        <div>Discount: {discountPercent}%</div>
                        <div>
                          Price After Discount: ${finalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-[#581838] mb-3">
                        Select Appointment Schedule
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="border border-[#E5E5E5] rounded-lg px-4 py-3"
                        />
                        <input
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="border border-[#E5E5E5] rounded-lg px-4 py-3"
                        />
                      </div>
                    </div>
                  </div>

                  <AppButton
                    variant="primary"
                    onClick={handleConfirmBooking}
                    disabled={accepting || !selectedDate || !selectedTime}
                    className="text-lg py-3"
                  >
                    {accepting ? "Booking..." : "Pay Now"}
                  </AppButton>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
