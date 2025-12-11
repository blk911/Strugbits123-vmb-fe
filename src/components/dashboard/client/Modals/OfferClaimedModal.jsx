import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import claimGif from "../../../../assets/claimed.gif";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useAcceptInviteMutation,
  useGetSalonByIdQuery,
} from "../../../../store/api";
import { setSelectedSalon } from "../../../../store/features/selectedSalonSlice";
import { toastLoading } from "../../../../utils/toast";
export default function OfferClaimedModal({ isOpen, closeModal, data }) {
  const salon = data;
  const services = Array.isArray(salon?.services) ? salon.services : [];

  const discountPercent = salon?.discount || 0;

  const subtotal = services.reduce((sum, s) => sum + s.price, 0) || 0;
  const discountValue = (subtotal * discountPercent) / 100;
  const finalPrice = subtotal - discountValue;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const salonId = salon?.salonId;
  const {
    data: salonResponse,
    isLoading: loadingSalon,
    isSuccess,
  } = useGetSalonByIdQuery(salonId, {
    skip: !isOpen || !salonId,
  });
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
              <Dialog.Panel
                style={{ background: "#FFF2F4" }}
                className="relative w-full max-w-[480px] rounded-[20px] p-[30px] shadow-xl flex flex-col gap-6"
              >
                <IoClose
                  onClick={closeModal}
                  className="absolute top-6 right-6 text-[#581838] text-3xl cursor-pointer hover:opacity-80"
                />

                <div className="text-center mt-3 flex flex-col items-center">
                  <img
                    src={claimGif}
                    className="w-[138px] h-[138px] "
                    alt="Offer Claimed"
                  />

                  <h3 className="text-[#FF92A5] font-bold text-[22px] mt-4">
                    Offer Claimed!
                  </h3>

                  <p className="text-[#00000080] text-[14px] mt-2">
                    This offer is now active under your profile
                    <br /> for the next 14 days.
                  </p>
                </div>

                <div className="bg-white border border-[#0000001A] rounded-[10px] p-5 space-y-5">
                  <div className="flex items-center justify-between border border-[#9CA3AF4D] rounded-xl p-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={salon?.image}
                        alt={salon?.name}
                        className="w-10 h-10 rounded-lg object-cover  border border-gray-200"
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
                    <div className="border border-[#9CA3AF4D] rounded-lg p-3 text-sm flex flex-col gap-2">
                      <div className="flex justify-between text-[12px]  font-medium text-[#000]">
                        <div>Service</div>
                        <div>Duration</div>
                        <div>Price</div>
                      </div>
                      {services.map((s, i) => (
                        <div
                          key={i}
                          className={`flex justify-between text-[#4B5563] mt-2 ${
                            i === services?.length - 1
                              ? ""
                              : "border-b border-[#D9D9D9]"
                          }`}
                        >
                          <div>{s.name}</div>
                          <div>{s.duration}</div>
                          <div>${s.price}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col items-end gap-1 text-[#FF92A5] font-bold text-sm">
                      <div>Discount (%) : &nbsp; {discountPercent}%</div>
                      <div>Price After Discount: ${finalPrice.toFixed(2)}</div>
                    </div>
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
