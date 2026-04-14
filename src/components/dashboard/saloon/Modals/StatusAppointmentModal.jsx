import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useLayoutEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import salonIcon from "../../../../assets/salon-1.png";
import ServicesTable from "../../../common/dashboard/ServicesTable";
const DEFAULT_DATA = {
  salon: { name: "Luxe Beauty Salon", description: "Premium Beauty Services" },
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
    date: "2025-08-04",
    time: "11:00 AM",
  },
};

export default function StatusAppointmentModal({
  isOpen,
  closeModal,
  type = "hold",
  data = DEFAULT_DATA,
}) {
  const merged = { ...DEFAULT_DATA, ...(data || {}) };
  merged.treatTo = { ...DEFAULT_DATA.treatTo, ...(data?.treatTo || {}) };
  merged.treatBy = { ...DEFAULT_DATA.treatBy, ...(data?.treatBy || {}) };
  merged.services = data?.services || DEFAULT_DATA.services;
  merged.appointment = {
    ...DEFAULT_DATA.appointment,
    ...(data?.appointment || {}),
  };

  const totalPrice = (merged.services || []).reduce(
    (s, it) => s + (it.price || 0),
    0,
  );
  const appointmentType = data?.appointment?.type;
  let finalTotal;

  if (appointmentType === "invite") {
    // finalTotal=totalPrice
    // finalTotal = (totalPrice-((totalPrice * merged?.services[0]?.discount)/100));
    finalTotal = data?.appointment?.amountPaid;
  } else if (appointmentType === "booking") {
    finalTotal = totalPrice + 2.5;
  } else if (appointmentType === "gift") {
    finalTotal = totalPrice + totalPrice * 0.1;
  } else {
    finalTotal = totalPrice;
  }
  const copy = {
    scheduled: {
      title: "Appointment Scheduled",
      subtitle: "Appointment has been successfully scheduled!",
    },
    hold: {
      title: "Appointment Request on Hold",
      subtitle:
        "The client has paused this booking. You’ll be notified once they confirm or make changes.",
    },
    declined: {
      title: "Appointment Request Declined",
      subtitle:
        "The client has declined the booking request. You may reach out to offer a new slot or alternative service.",
    },
    confirmed: {
      title: "Appointment Confirmed",
      subtitle:
        "The client has confirmed their booking. You can now proceed with the appointment details and preparation.",
    },
  };

  const title = (copy[type] && copy[type].title) || copy.hold.title;
  const subtitle = (copy[type] && copy[type].subtitle) || copy.hold.subtitle;

  const TreatBlock = ({ left, right }) => (
    <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-3 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-poppins text-[14px]  text-vmb-primary font-medium">
          {appointmentType === "gift" ? "Treat to:" : " Paid by:"}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <img
            src={left.image || ""}
            alt={left.name}
            className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0 border border-vmb-primary/10"
          />
          <div>
            <p className="font-semibold text-[14px] text-vmb-text-muted">
              {left.name}
            </p>
            <p className="text-[12px] text-vmb-text-muted">{left.email}</p>

            {left.phone && (
              <p className="text-[12px] text-vmb-text-muted">{left.phone}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-poppins text-[14px] text-vmb-primary font-medium">
          {appointmentType === "gift" ? "Treat by:" : " Paid to:"}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <img
            src={right.image || ""}
            alt={right.name}
            className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0 border border-vmb-primary/10"
          />
          <div>
            <p className="font-semibold text-[14px] text-vmb-primary">
              {right.name}
            </p>
            <p className="text-[12px] text-vmb-text-muted">{right.email}</p>

            {right.phone && (
              <p className="text-[12px] text-vmb-text-muted">{right.phone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ServicesBlock = () => (
    <div className="border border-vmb-primary/10 rounded-[10px] p-[10px] flex flex-col gap-[10px]">
      <p className="text-vmb-primary text-[14px] font-medium">Services:</p>
      <ServicesTable
        services={merged.services}
        containerClass="border border-vmb-primary/10 rounded-[10px] p-2 sm:p-3 text-[11px] sm:text-[12px]"
        scrollbarClass="custom-scrollbar"
        maxHeightClass="max-h-32"
        headerClass="px-1"
        rowClass="border-t border-vmb-bg-soft pt-2 text-vmb-primary text-[11px] sm:text-[12px]"
      />

      <div className="flex justify-end">
        <p className="text-vmb-secondary font-bold text-[13px]">
          Amount Paid: ${finalTotal.toFixed(2)}
        </p>
      </div>
    </div>
  );

  const AppointmentDetailsBlock = () => (
    <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-[10px] flex flex-col gap-[20px] ">
      <p className="text-vmb-primary font-medium text-[14px]">
        Appointment Details
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[14px] font-medium text-vmb-text-main block mb-2">
            Date
          </label>
          <div className="flex items-center gap-2 border border-vmb-primary/10 bg-white rounded-[8px] p-3">
            <FaCalendarAlt className="text-vmb-primary" />
            <span className="text-[14px] text-vmb-text-main">
              {merged.appointment.date}
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
              {merged.appointment.time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrder = () => {
    if (type === "confirmed") {
      return (
        <>
          <AppointmentDetailsBlock />
          <ServicesBlock />
          <TreatBlock left={merged.treatTo} right={merged.treatBy} />
        </>
      );
    }
    if (type === "scheduled") {
      return (
        <>
          <AppointmentDetailsBlock />
          <ServicesBlock />
          <TreatBlock left={merged.treatTo} right={merged.treatBy} />
        </>
      );
    }
    if (type === "declined") {
      return (
        <>
          <TreatBlock left={merged.treatTo} right={merged.treatBy} />
          <ServicesBlock />
        </>
      );
    }
    return (
      <>
        <TreatBlock left={merged.treatTo} right={merged.treatBy} />
        <ServicesBlock />
        <AppointmentDetailsBlock />
      </>
    );
  };

  return (
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
          <div className="fixed inset-0 bg-vmb-overlay-bg" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-250"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-[450px] transform overflow-hidden rounded-[20px] border border-vmb-primary/10 backdrop-blur-[1px]  bg-vmb-modals-bg p-[30px] shadow-xl transition-all">
                <IoClose
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-vmb-primary text-2xl cursor-pointer"
                />

                <div className="flex flex-col items-center text-center mt-6">
                  <h2 className="text-vmb-primary font-bold text-[22px]">
                    {title}
                  </h2>
                  <p className="text-vmb-text-muted/50 text-[14px] mt-2 leading-[20px]">
                    {subtitle}
                  </p>
                </div>

                <div className="mt-6 relative w-full overflow-hidden transition-all duration-300 ease-in-out">
                  <div className="bg-white/50 border border-vmb-primary/10 rounded-[10px] p-[20px] flex flex-col gap-[20px]">
                    {renderOrder()}
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
