import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useRef } from "react";
import { IoClose, IoCopyOutline, IoChevronDown } from "react-icons/io5";
import CustomCheckbox from "../../../common/site/CustomCheckbox";

export default function GiftServiceModal({ isOpen, closeModal, initialData }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Extract salon & service from initialData (passed from ServiceCard)
  const salon = initialData?.salon;
  const service = initialData?.service;

  useEffect(() => {
    if (isOpen && salon && service) {
      setIsSubmitted(false);
      setSelectedServices([service.name]);
      setEmail("");
      setMessage("");
    } else if (isOpen) {
      setIsSubmitted(false);
      setSelectedServices([]);
      setEmail("");
      setMessage("");
    }
  }, [isOpen, salon, service]);

  // Close dropdown when clicking outside
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
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleSubmit = () => {
    if (selectedServices.length === 0 || !email) return;
    setIsSubmitted(true);
  };

  const getServiceDetails = (name) =>
    salon?.services.find((s) => s.name === name);

  const totalPrice = selectedServices.reduce((sum, name) => {
    const svc = getServiceDetails(name);
    return sum + (svc ? parseFloat(svc.price) : 0);
  }, 0);

  return (
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
              <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-10 shadow-2xl transition-all flex flex-col gap-8">
                <IoClose
                  onClick={closeModal}
                  className="absolute top-6 right-6 text-[#581838] text-3xl cursor-pointer hover:opacity-80"
                />

                {!isSubmitted ? (
                  <>
                    <div>
                      <h3 className="text-[#581838] font-bold text-2xl text-center">
                        Gift Service
                      </h3>
                    </div>

                    {/* Salon Info Row */}
                    <div className="flex items-center gap-4">
                      <img
                        src={salon?.image || salon?.images?.[0]}
                        alt={salon?.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      />
                      <div>
                        <p className="text-[#4B5563] font-semibold text-xl">
                          {salon?.name}
                        </p>
                        <p className="text-[#4B5563] text-xs">
                          Premium Beauty Services
                        </p>
                      </div>
                    </div>

                    {/* Select Services */}
                    <div className="relative" ref={dropdownRef}>
                      <label className="text-[#404040] text-sm font-medium">
                        Select Services
                      </label>
                      <div
                        onClick={() => setServiceDropdownOpen((prev) => !prev)}
                        className="w-full mt-2 border border-[#E5E5E5] rounded-lg py-3 px-4 pr-10 text-sm text-[#00000080] flex justify-between items-center cursor-pointer flex-wrap gap-2 min-h-[48px] bg-white"
                      >
                        {selectedServices.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedServices.map((srv) => (
                              <div
                                key={srv}
                                className="flex items-center gap-2 bg-[#64748B] text-white rounded-md px-3 py-1.5 text-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>{srv}</span>
                                <button
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

                      {serviceDropdownOpen && (
                        <div className="absolute w-full bg-white border border-[#E5E5E5] rounded-lg mt-2 p-4 z-10 shadow-xl max-h-60 overflow-y-auto">
                          {salon?.services.map((svc) => (
                            <CustomCheckbox
                              key={svc.id}
                              label={`${svc.name} (${svc.duration} min - $${svc.price})`}
                              checked={selectedServices.includes(svc.name)}
                              onChange={() => toggleService(svc.name)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Services Summary */}
                    {selectedServices.length > 0 && (
                      <div className="border border-[#5818381A] bg-[#F2F2F2] rounded-md p-4 flex flex-col gap-3">
                        <div className="flex justify-between text-xs font-medium text-[#4B5563]">
                          <span>Service</span>
                          <span>Duration</span>
                          <span>Price</span>
                        </div>
                        {selectedServices.map((name) => {
                          const s = getServiceDetails(name);
                          return (
                            <div
                              key={name}
                              className="border-t border-[#D9D9D9] pt-3 flex justify-between text-xs text-[#4B5563]"
                            >
                              <span>{s?.name}</span>
                              <span>{s?.duration} min</span>
                              <span>${s?.price}</span>
                            </div>
                          );
                        })}
                        <div className="border-t-2 border-[#581838] pt-2 font-bold text-[#581838]">
                          Total: ${totalPrice.toFixed(2)}
                        </div>
                      </div>
                    )}

                    {/* Who’s treating you? */}
                    <div>
                      <h4 className="text-[#581838] font-bold text-xl">
                        Who’s treating you?
                      </h4>
                      <label className="text-[#404040] text-sm mt-3 block">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email..."
                        className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-sm mt-1 focus:outline-none focus:border-[#FF92A5]"
                      />

                      <label className="text-[#404040] text-sm mt-4 block">
                        Write a sweet message
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full border border-[#E5E5E5] rounded-lg p-4 text-sm mt-1 resize-none focus:outline-none focus:border-[#FF92A5]"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!email || selectedServices.length === 0}
                      className="w-full bg-[#FF92A5] text-white text-lg rounded-lg py-3 font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Request Now
                    </button>
                  </>
                ) : (
                  /* Submitted View */
                  <>
                    <div className="text-center">
                      <h3 className="text-[#FF92A5] font-bold text-2xl">
                        Gift Request Sent!
                      </h3>
                      <p className="text-[#00000080] text-sm mt-3">
                        Your request has been shared successfully.
                        <br />
                        Wait for payment confirmation.
                      </p>
                    </div>

                    <div className="border border-[#FF92A5] bg-white rounded-xl p-6 space-y-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={salon?.image || salon?.images?.[0]}
                          alt={salon?.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-[#4B5563] font-semibold text-xl">
                            {salon?.name}
                          </p>
                          <p className="text-[#4B5563] text-xs">
                            Premium Beauty Services
                          </p>
                        </div>
                      </div>

                      <div className="border border-[#5818381A] bg-[#F2F2F2] rounded-md p-4">
                        <div className="flex justify-between text-xs font-medium text-[#4B5563]">
                          <span>Service</span>
                          <span>Duration</span>
                          <span>Price</span>
                        </div>
                        {selectedServices.map((name) => {
                          const s = getServiceDetails(name);
                          return (
                            <div
                              key={name}
                              className="border-t border-[#D9D9D9] pt-3 flex justify-between text-xs text-[#4B5563]"
                            >
                              <span>{s?.name}</span>
                              <span>{s?.duration} min</span>
                              <span>${s?.price}</span>
                            </div>
                          );
                        })}
                        <div className="border-t-2 border-[#581838] pt-2 font-bold text-[#581838]">
                          Total: ${totalPrice.toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <p className="text-[#581838] font-bold text-lg">
                          Who’s treating you?
                        </p>
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className="w-full border border-[#E5E5E5] bg-[#F9FAFB] rounded-lg px-4 py-3 text-sm mt-2 cursor-not-allowed"
                        />
                        <textarea
                          rows={3}
                          value={message}
                          readOnly
                          className="w-full border border-[#E5E5E5] bg-[#F9FAFB] rounded-lg p-4 text-sm mt-4 resize-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <p className="text-center italic text-[#00000080] text-sm mt-6">
                      Copy link to share this gift request.
                    </p>
                    <div className="mt-3 border border-[#0000001A] rounded-xl flex justify-between items-center px-4 py-3">
                      <span className="italic text-sm text-[#00000080] truncate">
                        https://yourdomain.com/gift/vmb-demo
                      </span>
                      <IoCopyOutline className="text-[#581838] text-2xl cursor-pointer hover:opacity-80" />
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
