import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import salonImg from "../../../../assets/salon-1.png";
import CustomCheckbox from "../../../common/site/CustomCheckbox";
import successGif from "../../../../assets/successGif.gif";
import AppButton from "../../../common/site/AppButton";

export default function BookAppointmentModal({ isOpen, closeModal }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const salonData = {
    name: "Bella Beauty Salon",
    description: "Premium Beauty Services",
    services: [
      { name: "Haircut", duration: "0.5 Hr", price: "$50" },
      { name: "Hydrafacial", duration: "1 Hr", price: "$80" },
      { name: "Full Color", duration: "1.5 Hr", price: "$100" },
    ],
  };

  const toggleService = (serviceName) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const getServiceDetails = (name) =>
    salonData.services.find((s) => s.name === name);

  const handleConfirm = () => {
    closeModal();
    setTimeout(() => setShowSuccessModal(true), 300);
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
                <Dialog.Panel className="relative w-full max-w-[420px] transform overflow-hidden rounded-[10px] bg-white p-10 shadow-xl transition-all flex flex-col gap-8">
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
                      src={salonImg}
                      alt="Salon"
                      className="w-[60px] h-[60px] rounded-md object-cover"
                    />
                    <div>
                      <p className="text-[#4B5563] font-semibold text-[20px]">
                        {salonData.name}
                      </p>
                      <p className="text-[#4B5563] text-[12px]">
                        {salonData.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[#404040] text-[14px] font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="border border-[#E5E5E5] bg-[#F2F2F2] rounded-[8px] px-3 py-3 text-[16px] text-black focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label className="text-[#404040] text-[14px] font-medium">
                      Select Services
                    </label>
                    <div
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="w-full border border-[#E5E5E5] rounded-[8px] py-2 px-3 pr-8 text-sm text-[#00000080] flex justify-between items-center cursor-pointer mt-1 flex-wrap gap-2 min-h-[42px]"
                    >
                      {selectedServices.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedServices.map((srv, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 bg-[#64748B] text-white rounded-md px-3 py-[6px] text-[13px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>{srv}</span>
                              <button
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

                    {dropdownOpen && (
                      <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E5E5] rounded-[8px] shadow-md z-10 p-3 max-h-[180px] overflow-y-auto">
                        {salonData.services.map((s, i) => (
                          <CustomCheckbox
                            key={i}
                            label={`${s.name} (${s.duration} - ${s.price})`}
                            checked={selectedServices.includes(s.name)}
                            onChange={() => toggleService(s.name)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedServices.length > 0 && (
                    <div className="border border-[#5818381A] bg-[#F2F2F2] rounded-[5px] p-3 flex flex-col gap-2">
                      <div className="flex justify-between text-[12px] text-[#4B5563] font-medium">
                        <span>Service:</span>
                        <span>Duration:</span>
                        <span>Price:</span>
                      </div>

                      {selectedServices.map((srvName, idx) => {
                        const s = getServiceDetails(srvName);
                        return (
                          <div
                            key={idx}
                            className="border-t border-[#D9D9D9] pt-2 flex justify-between text-[12px] text-[#4B5563]"
                          >
                            <span>{s?.name}</span>
                            <span>{s?.duration}</span>
                            <span>{s?.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[#404040] text-[14px] font-medium">
                        Booking Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-[#E5E5E5] bg-white rounded-[8px] px-3 py-3 text-[14px] text-[#00000080] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[#404040] text-[14px] font-medium">
                        Booking Time
                      </label>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="border border-[#E5E5E5] bg-white rounded-[8px] px-3 py-3 text-[14px] text-[#00000080] focus:outline-none"
                      />
                    </div>
                  </div>
                  <AppButton
                    variant="primary"
                    size="custom"
                    onClick={handleConfirm}
                    className="text-[16px]  py-3"
                  >
                    Confirm & Pay
                  </AppButton>
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

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
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
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
