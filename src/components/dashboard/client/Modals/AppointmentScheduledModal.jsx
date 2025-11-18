import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose, IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import salonIcon from "../../../../assets/salon-1.png";

import holdImg from "../../../../assets/holdImg.png";
import confirmGif from "../../../../assets/successGif.gif";
import declineGif from "../../../../assets/declineGif.gif";
import rescheduleSentImg from "../../../../assets/rescheduleSent.png";
import AppButton from "../../../common/site/AppButton";

export default function AppointmentScheduledModal({
  isOpen,
  closeModal,
  initialData,
}) {
  if (initialData) {
    if (
      !(initialData?.salon && initialData?.services && initialData?.appointment)
    ) {
      return null;
    }
  }
  const mock = initialData || {
    salon: {
      name: "Luxe Beauty Salon",
      description: "Premium Beauty Services",
      image: salonIcon,
    },
    services: [
      { name: "Haircut & Styling", duration: "1 Hr", price: 50 },
      { name: "HydraFacial", duration: "1.5 Hr", price: 120 },
    ],
    appointment: {
      date: "02-08-2025",
      time: "12:00 PM",
    },
  };

  const totalPrice = mock?.services?.reduce((s, it) => s + (it.price || 0), 0);

  const [holdOpen, setHoldOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleSentOpen, setRescheduleSentOpen] = useState(false);

  const openHold = () => {
    closeModal();
    setTimeout(() => setHoldOpen(true), 150);
  };
  const openConfirm = () => {
    closeModal();
    setTimeout(() => setConfirmOpen(true), 150);
  };
  const openDecline = () => {
    closeModal();
    setTimeout(() => setDeclineOpen(true), 150);
  };
  const openReschedule = () => {
    closeModal();
    setTimeout(() => setRescheduleOpen(true), 150);
  };

  const submitRescheduleRequest = () => {
    setRescheduleOpen(false);
    setTimeout(() => setRescheduleSentOpen(true), 150);
  };

  function StatusModal({ open, setOpen, imageSrc, title, subtitle }) {
    return (
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-[Poppins]"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-250"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-250"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-[10px] p-[30px] flex flex-col items-center gap-3 w-full max-w-[468px] text-center">
                <img
                  src={imageSrc}
                  alt={title}
                  className="w-[96px] h-[96px] object-contain"
                />
                <h2 className="text-[#FF92A5] font-bold text-[20px]">
                  {title}
                </h2>
                <p className="text-[#404040] text-[14px] font-medium leading-[20px]">
                  {subtitle}
                </p>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  }

  function RescheduleModal({ open, setOpen, data }) {
    const [reasonText, setReasonText] = useState(
      "I’d like to reschedule my booking. Please update the appointment time as per the new availability. 5pm on Wednesday 15 Oct, 2025"
    );

    const total = data.services.reduce((s, it) => s + (it.price || 0), 0);

    return (
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-[Poppins]"
          onClose={() => setOpen(false)}
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
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-[470px] transform overflow-hidden rounded-[20px] border border-[#5818381A] bg-[#FFF2F4] p-[30px] shadow-xl transition-all flex flex-col gap-[23px]">
                  <IoClose
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer"
                  />

                  <div className="text-center">
                    <h3 className="text-[#581838] font-bold text-[22px]">
                      Reschedule Appointments
                    </h3>
                  </div>

                  <div className="bg-white border border-[#0000001A] rounded-[10px] p-5 flex flex-col gap-4">
                    <div className="border border-[#0000001A] rounded-[10px] p-3 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      <img
                        src={data.salon.image}
                        alt="Salon"
                        className="w-[40px] h-[40px] rounded-md object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[#4B5563] font-semibold text-[14px] break-words">
                          {data.salon.name}
                        </p>
                        <p className="text-[#4B5563] text-[12px] break-words">
                          {data.salon.description}
                        </p>
                      </div>
                    </div>

                    <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[10px]">
                      <p className="text-[#581838] text-[14px] font-medium">
                        Paying For:
                      </p>

                      <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[12px]">
                        <div className="flex justify-between text-[12px] font-medium text-black">
                          <span>Service</span>
                          <div className="flex gap-8">
                            <span>Duration</span>
                            <span>Price</span>
                          </div>
                        </div>

                        {data.services.map((srv, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-[12px] text-[#581838]"
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
                          Total Price: ${total}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[#581838] font-medium text-[14px] mb-2">
                        Write a reason for reschedule:
                      </p>
                      <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-3">
                        <textarea
                          value={reasonText}
                          onChange={(e) => setReasonText(e.target.value)}
                          rows={3}
                          className="w-full text-[12px] italic text-[#00000080] resize-none bg-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div className=" flex-1">
                      <AppButton
                        variant="primary"
                        size="custom"
                        onClick={submitRescheduleRequest}
                        className="mt-6  font-semibold text-[14px] px-[20px] py-[12px]"
                      >
                        Request Reschedule Now
                      </AppButton>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

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
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-[460px] transform overflow-hidden rounded-[20px] border border-[#5818381A] bg-[#FFF2F4] p-[30px] shadow-xl transition-all flex flex-col gap-[23px]">
                  <IoClose
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer"
                  />

                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-[#581838] font-bold text-[22px]">
                      Great News! Your appointment is Scheduled.
                    </h2>
                    <p className="text-[#00000080] text-[14px] mt-2 leading-[20px]">
                      The salon has successfully scheduled your appointment.
                      Please review the details below and confirm your
                      appointment.
                    </p>
                  </div>

                  <div className="bg-white border border-[#0000001A] rounded-[10px] p-5 flex flex-col gap-4">
                    <div className="border border-[#0000001A] rounded-[10px] p-3 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      <img
                        src={mock.salon.image}
                        alt="Salon"
                        className="w-[40px] h-[40px] rounded-md object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[#4B5563] font-semibold text-[14px] break-words">
                          {mock.salon.name}
                        </p>
                        <p className="text-[#4B5563] text-[12px] break-words">
                          {mock.salon.description}
                        </p>
                      </div>
                    </div>

                    <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[10px]">
                      <h3 className="text-[#581838] text-[14px] font-medium">
                        Services:
                      </h3>

                      <div className="border border-[#9CA3AF4D] rounded-[10px] p-[10px] flex flex-col gap-[12px]">
                        <div className="flex justify-between text-[12px] font-medium text-black">
                          <span>Service</span>
                          <div className="flex gap-8">
                            <span>Duration</span>
                            <span>Price</span>
                          </div>
                        </div>

                        {mock.services.map((srv, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-[12px] text-[#581838]"
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

                    <div className="border border-[#0000001A] bg-[#F0F0F0] rounded-[10px] p-[10px] flex flex-col gap-[20px]">
                      <p className="text-[#581838] font-medium text-[14px]">
                        Appointment Details
                      </p>

                      <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
                        <div className="flex-1">
                          <p className="text-[#404040] text-[14px] font-medium mb-1">
                            Date
                          </p>
                          <div className="flex items-center gap-2 text-[#00000080] text-[14px]">
                            <IoCalendarOutline className="text-[#00000080]" />
                            <span>{mock.appointment.date}</span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <p className="text-[#404040] text-[14px] font-medium mb-1">
                            Time
                          </p>
                          <div className="flex items-center gap-2 text-[#00000080] text-[14px]">
                            <IoTimeOutline className="text-[#00000080]" />
                            <span>{mock.appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full sm:grid-cols-2">
                      <AppButton
                        variant="outline-dark"
                        size="custom"
                        onClick={openHold}
                        className="py-[15px] px-[20px] text-[14px]"
                      >
                        Hold
                      </AppButton>

                      <AppButton
                        variant="outline-dark"
                        size="custom"
                        onClick={openReschedule}
                        className="py-[15px] px-[20px] text-[14px]"
                      >
                        Reschedule
                      </AppButton>

                      <AppButton
                        variant="outline-dark"
                        size="custom"
                        onClick={openDecline}
                        className="py-[15px] px-[20px] text-[14px]"
                      >
                        Decline
                      </AppButton>

                      <AppButton
                        variant="primary"
                        size="custom"
                        onClick={openConfirm}
                        className="py-[15px] px-[20px] text-[14px]"
                      >
                        Accept
                      </AppButton>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <StatusModal
        open={holdOpen}
        setOpen={setHoldOpen}
        imageSrc={holdImg}
        title="Appointment On Hold"
        subtitle="You’ve paused this appointment. Resume it whenever you’re ready!"
      />

      <StatusModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        imageSrc={confirmGif}
        title="Appointment Confirmed"
        subtitle="Your appointment has been successfully confirmed. The salon has been notified and will be expecting you at the scheduled time."
      />

      <StatusModal
        open={declineOpen}
        setOpen={setDeclineOpen}
        imageSrc={declineGif}
        title="You Declined the Booking"
        subtitle="Your booking request has been declined. The salon will be informed right away."
      />

      <RescheduleModal
        open={rescheduleOpen}
        setOpen={setRescheduleOpen}
        data={mock}
      />

      <StatusModal
        open={rescheduleSentOpen}
        setOpen={setRescheduleSentOpen}
        imageSrc={rescheduleSentImg}
        title="Reschedule Request Sent"
        subtitle="Your reschedule request has been successfully sent to the salon. You’ll be notified once the salon reviews and confirms the new appointment time."
      />
    </>
  );
}
