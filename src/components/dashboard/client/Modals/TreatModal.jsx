import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState, useRef } from "react";
import { IoClose, IoCopyOutline, IoChevronDown } from "react-icons/io5";
import salonImg from "../../../../assets/salon-1.png";
import CustomCheckbox from "../../../common/site/CustomCheckbox";

export default function TreatModal({ isOpen, closeModal }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setSelectedSalon("");
      setSelectedServices([]);
      setEmail("");
      setMessage("");
      setServiceDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServiceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const salons = [
    {
      name: "Bella Beauty Salon",
      description: "Premium Beauty Services",
      services: [
        { name: "Haircuts", duration: "0.5 Hr", price: "$50" },
        { name: "Hydrafacial", duration: "1 Hr", price: "$80" },
        { name: "Full color", duration: "1.5 Hr", price: "$100" },
      ],
    },
    {
      name: "Glam Studio",
      description: "Premium Beauty Services",
      services: [
        { name: "Highlights", duration: "1 Hr", price: "$75" },
        { name: "Standard Facials", duration: "0.5 Hr", price: "$45" },
      ],
    },
    {
      name: "Radiance Spa",
      description: "Premium Beauty Services",
      services: [
        { name: "Dermaplaning", duration: "1 Hr", price: "$65" },
        { name: "Hydrafacial", duration: "1 Hr", price: "$85" },
      ],
    },
  ];

  const selectedSalonData = salons.find((s) => s.name === selectedSalon);

  const toggleService = (serviceName) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleSubmit = () => {
    if (!selectedSalon || selectedServices.length === 0 || !email) return;
    setIsSubmitted(true);
  };

  const getServiceDetails = (name) =>
    selectedSalonData?.services.find((s) => s.name === name);

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
              <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-xl transition-all">
                <IoClose
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer"
                />

                {!isSubmitted ? (
                  <>
                    {/* HEADER */}
                    <Dialog.Title
                      as="h3"
                      className="text-center text-[24px] font-bold text-[#581838]"
                    >
                      Treat Me, Baby!
                    </Dialog.Title>
                    <p className="text-center text-[#00000080] italic text-[14px] mt-1">
                      Get pampered — request a treat from someone you love!
                    </p>

                    {/* SALON DROPDOWN */}
                    <div className="mt-6">
                      <label className="text-[#404040] text-[14px] font-medium">
                        Select Salon
                      </label>
                      <div className="relative mt-1">
                        <select
                          value={selectedSalon}
                          onChange={(e) => {
                            setSelectedSalon(e.target.value);
                            setSelectedServices([]);
                          }}
                          className="w-full border border-[#E5E5E5] rounded-[8px] py-2 px-3 pr-8 text-sm text-[#00000080] appearance-none focus:outline-none"
                        >
                          <option value="">Find your salon..</option>
                          {salons.map((salon, i) => (
                            <option key={i} value={salon.name}>
                              {salon.name}
                            </option>
                          ))}
                        </select>
                        <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#581838]" />
                      </div>
                    </div>

                    {/* SERVICE DROPDOWN WITH CHECKBOX */}
                    {selectedSalonData && (
                      <div className="mt-5 relative" ref={dropdownRef}>
                        <label className="text-[#404040] text-[14px] font-medium">
                          Select Services
                        </label>
                        {/* <div
                          onClick={() =>
                            setServiceDropdownOpen((prev) => !prev)
                          }
                          className="w-full border border-[#E5E5E5] rounded-[8px] py-2 px-3 pr-8 text-sm text-[#00000080] flex justify-between items-center cursor-pointer mt-1"
                        >
                          <span>
                            {selectedServices.length > 0
                              ? `${selectedServices.length} service(s) selected`
                              : "Choose services..."}
                          </span>
                          <IoChevronDown
                            className={`text-[#581838] transition-transform ${
                              serviceDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div> */}
                        <div
                          onClick={() =>
                            setServiceDropdownOpen((prev) => !prev)
                          }
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
                              serviceDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {serviceDropdownOpen && (
                          <div className="absolute w-full bg-white border border-[#E5E5E5] rounded-[8px] mt-1 p-3 z-10 shadow-lg max-h-[180px] overflow-y-auto">
                            {selectedSalonData.services.map((service, i) => (
                              <CustomCheckbox
                                key={i}
                                label={`${service.name} (${service.duration} - ${service.price})`}
                                checked={selectedServices.includes(
                                  service.name
                                )}
                                onChange={() => toggleService(service.name)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SERVICE SUMMARY */}
                    {selectedServices.length > 0 && (
                      <div className="mt-6 border border-[#5818381A] bg-[#F2F2F2] rounded-[5px] p-3 flex flex-col gap-2">
                        <div className="flex justify-between text-[12px] text-[#4B5563] font-medium">
                          <span>Service:</span>
                          <span>Duration:</span>
                          <span>Price:</span>
                        </div>
                        {selectedServices.map((srv, i) => {
                          const s = getServiceDetails(srv);
                          return (
                            <div
                              key={i}
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

                    {/* EMAIL & MESSAGE */}
                    <div className="mt-6">
                      <h4 className="text-[#581838] font-bold text-[20px]">
                        Who’s treating you?
                      </h4>

                      <label className="text-[#404040] text-[14px] mt-2 block">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email..."
                        className="w-full border border-[#E5E5E5] rounded-[8px] px-3 py-2 text-sm text-[#00000080] mt-1"
                      />

                      <label className="text-[#404040] text-[14px] mt-3 block">
                        Write a sweet message
                      </label>
                      <textarea
                        rows="3"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full border border-[#E5E5E5] rounded-[8px] p-3 text-sm text-[#00000080] mt-1 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full mt-6 bg-[#FF92A5] text-white text-[16px] rounded-[8px] py-2 font-medium hover:opacity-90"
                    >
                      Request Now
                    </button>
                  </>
                ) : (
                  <>
                    {/* SUCCESS STATE */}
                    <Dialog.Title
                      as="h3"
                      className="text-center text-[22px] font-bold text-[#FF92A5]"
                    >
                      Treat Request Sent!
                    </Dialog.Title>
                    <p className="text-center text-[#00000080] text-[14px] mt-2">
                      Your request has been shared successfully. You’ll be
                      updated soon.
                    </p>

                    <div className="mt-6 border border-[#FF92A5] bg-white rounded-[10px] p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={salonImg}
                          alt="Salon"
                          className="w-[60px] h-[60px] rounded-md object-cover"
                        />
                        <div>
                          <p className="text-[#4B5563] font-semibold text-[18px]">
                            {selectedSalon}
                          </p>
                          <p className="text-[#4B5563] text-[12px]">
                            {selectedSalonData?.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 border border-[#5818381A] bg-[#F2F2F2] rounded-[5px] p-3 flex flex-col gap-2">
                        <div className="flex justify-between text-[12px] text-[#4B5563] font-medium">
                          <span>Service:</span>
                          <span>Duration:</span>
                          <span>Price:</span>
                        </div>
                        {selectedServices.map((srv, i) => {
                          const s = getServiceDetails(srv);
                          return (
                            <div
                              key={i}
                              className="border-t border-[#D9D9D9] pt-2 flex justify-between text-[12px] text-[#4B5563]"
                            >
                              <span>{s?.name}</span>
                              <span>{s?.duration}</span>
                              <span>{s?.price}</span>
                            </div>
                          );
                        })}
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
                          value={email}
                          readOnly
                          className="w-full border border-[#E5E5E5] bg-[#F9FAFB] rounded-[8px] px-3 py-2 text-sm text-[#00000080] mt-1 cursor-not-allowed"
                        />

                        <label className="text-[#404040] text-[14px] mt-3 block">
                          Write a sweet message
                        </label>
                        <textarea
                          rows="3"
                          value={message}
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
                        https://yourdomain.com/vmb-demo
                      </span>
                      <IoCopyOutline className="text-[#581838] text-xl cursor-pointer" />
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
