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
import ServicesTable from "../../../common/dashboard/ServicesTable";
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
  } = useGetSalonByIdQuery(
    { id: salonId },
    {
      skip: !isOpen || !salonId,
    }
  );
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
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto custom-scrollbar">
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
                className="relative w-full max-w-[480px] rounded-[20px] bg-vmb-bg-soft p-[30px] shadow-xl flex flex-col gap-6"
              >
                <IoClose
                  onClick={closeModal}
                  className="absolute top-6 right-6 text-vmb-primary text-3xl cursor-pointer hover:opacity-80"
                />

                <div className="text-center mt-3 flex flex-col items-center">
                  <img
                    src={claimGif}
                    className="w-[138px] h-[138px] "
                    alt="Offer Claimed"
                  />

                  <h3 className="text-vmb-secondary font-bold text-[22px] mt-4">
                    Offer Claimed!
                  </h3>

                  <p className="text-vmb-text-muted/50 text-[14px] mt-2">
                    You’ve successfully claimed this offer.
                  </p>
                </div>

                <div className="bg-white border border-vmb-primary/10 rounded-[10px] p-5 space-y-5">
                  <div className="flex items-center justify-between border border-vmb-primary/10 rounded-xl p-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={salon?.image}
                        alt={salon?.name}
                        className="w-10 h-10 rounded-lg object-cover  border border-vmb-primary/10"
                      />
                      <div>
                        <div className="text-[14px] sm:text-[16px] font-semibold text-vmb-text-muted">
                          {salon?.name}
                        </div>
                        <div className="text-[12px] sm:text-sm text-vmb-text-muted">
                          {salon?.description}
                        </div>
                      </div>
                    </div>

                    <button
                      className="text-xs px-3 py-1 bg-vmb-secondary/30 text-vmb-primary rounded cursor-pointer"
                      onClick={handleViewSalon}
                    >
                      View Salon
                    </button>
                  </div>

                  <div className="border border-vmb-primary/10 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-vmb-primary">
                      Exclusive Offer
                    </h4>
                    <ServicesTable
                      services={services}
                      containerClass="border border-vmb-primary/10 rounded-[10px] p-2 sm:p-3 text-[11px] sm:text-[12px]"
                      scrollbarClass="custom-scrollbar"
                      maxHeightClass="max-h-32"
                      headerClass="px-1"
                      rowClass="border-t border-vmb-primary/10 pt-2 text-vmb-primary text-[11px] sm:text-[12px]"
                    />

                    <div className="flex flex-col items-end gap-1 text-vmb-secondary font-bold text-[12px] sm:text-sm">
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
