import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoClose } from "react-icons/io5";
import salonIcon from "../../../../assets/salon-1.png";
import AppButton from "../../../common/site/AppButton";
export default function SendTreatModal({
  isOpen,
  closeModal,
  initialData,
  onAccept,
}) {
  const [selectedServices, setSelectedServices] = useState([]);
  const handleInvite = () => {
    closeModal();
    setTimeout(() => onAccept?.(), 200);
  };
  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const prefilledEmail = initialData?.email || "";
  const services = initialData?.services || [
    { id: 1, name: "Hair Cutting", price: 40, image: salonIcon },
    { id: 2, name: "Facial Glow", price: 65, image: salonIcon },
    { id: 3, name: "Manicure", price: 25, image: salonIcon },
    { id: 4, name: "Pedicure", price: 25, image: salonIcon },
    { id: 5, name: "Lash Lift", price: 25, image: salonIcon },
    { id: 6, name: "Lash Tint", price: 25, image: salonIcon },
  ];

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
          <div className="fixed inset-0 backdrop-blur-[5px] bg-black/10" />
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
              <Dialog.Panel className="relative w-full max-w-[616px] rounded-[10px] bg-[#FFFFFFE5] p-[30px] shadow-lg flex flex-col gap-[12px]">
                <IoClose
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-[#581838] text-2xl cursor-pointer"
                />

                <h2 className="text-center text-[#FF92A5] font-bold text-[22px]">
                  Send a Special Treat To Your Customer
                </h2>

                <p className="text-center text-[#00000080] text-[14px] leading-[20px]">
                  Invite your customer to enjoy one of your salon services. Add
                  a discount, include a short message, and send your invite
                  instantly. 💖
                </p>

                <div>
                  <label className="text-[14px] font-medium text-[#374151]">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={prefilledEmail}
                    className="w-full border border-[#E5E5E5] bg-white rounded-[8px] p-3 mt-1 text-[14px]"
                    placeholder="Enter email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[14px] font-medium text-[#374151]">
                      First Name
                    </label>
                    <input
                      className="w-full border border-[#E5E5E5] bg-white rounded-[8px] p-3 mt-1 text-[14px]"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-medium text-[#374151]">
                      Last Name
                    </label>
                    <input
                      className="w-full border border-[#E5E5E5] bg-white rounded-[8px] p-3 mt-1 text-[14px]"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-4 flex flex-col gap-4">
                  <p className="text-[14px] font-medium text-[#404040]">
                    Choose Services
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.length > 0 &&
                      services?.map((srv) => (
                        <label
                          key={srv.id}
                          className="flex items-center gap-3 p-2  cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(srv.id)}
                            onChange={() => toggleService(srv.id)}
                            className="w-4 h-4 text-[#581838]"
                            style={{ accentColor: "#581838" }}
                          />

                          <img
                            src={srv.image}
                            className="w-[46px] h-[46px] rounded-md shadow-md border border-[#FFFFFFB2]"
                            alt=""
                          />

                          <div>
                            <p className="text-[14px] font-semibold text-[#4B5563]">
                              {srv.name}
                            </p>
                            <p className="text-[12px] font-bold text-[#FF92A5]">
                              ${srv.price}
                            </p>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>

                <div>
                  <label className="text-[14px] font-medium text-[#404040]">
                    Service Discount (%)
                  </label>
                  <input
                    className="w-full border border-[#9CA3AF4D] bg-[#FFFFFF4D] rounded-[8px] p-3 mt-1 text-[14px]"
                    placeholder="Enter discount"
                  />
                </div>

                <div>
                  <label className="text-[14px] font-medium text-[#404040]">
                    Write your message
                  </label>

                  <div className="border border-[#E5E5E5] bg-white rounded-[8px] p-3 mt-1">
                    <textarea
                      rows={4}
                      className="w-full resize-none text-[12px] italic text-[#00000080] outline-none"
                      defaultValue={`Hi Juliana,
I want you to experience my salon with Hair Cutting at an exclusive discount!
Signup and book today.`}
                    ></textarea>
                  </div>
                </div>

                <AppButton
                  variant="primary"
                  size="custom"
                  className="text-[16px] font-medium  py-2 "
                  onClick={handleInvite}
                >
                  Invite Now
                </AppButton>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
