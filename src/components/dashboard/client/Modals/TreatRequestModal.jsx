import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { IoClose, IoTimeOutline } from "react-icons/io5";
import { FaTimes, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import salonImg from "../../../../assets/salon-1.png";
import userImg from "../../../../assets/user_icon.png";
import treatRequestIcon from "../../../../assets/treatRequestIcon.png";
import successGif from "../../../../assets/successGif.gif";
import AppButton from "../../../common/site/AppButton";
import {
  useAcceptGiftMutation,
  useCreateCheckoutSessionMutation,
  useGetSalonByIdQuery,
  useRejectGiftMutation,
} from "../../../../store/api";
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from "../../../../utils/toast";
import { setSelectedSalon } from "../../../../store/features/selectedSalonSlice";
import { useDispatch } from "react-redux";

function TreatRequestModal({ isOpen, closeModal, initialData }) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const mock = {
    salon: {
      name: "Bella Beauty Salon",
      description: "Premium Beauty Services",
      image: salonImg,
    },
    services: [
      { name: "Highlights and Lowlights", duration: "2.5 Hr", price: 150 },
      { name: "Hydrafacial", duration: "1 Hr", price: 85 },
    ],
    sender: {
      name: "Sarah Johnson",
      email: "sarah@gmail.com",
      avatar: userImg,
      message:
        "Hi! I’ve sent you a request to pay for my treat. Once the payment is complete, I’ll finalize the booking. Thanks! 💕",
    },
  };
  const dispatch = useDispatch();
  const info = initialData || mock;
  const gift = initialData?.gift;
  const salonId = gift?.salonId?._id;
  const giftId = gift?._id;
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
  const [rejectGift, { isLoading: rejecting }] = useRejectGiftMutation();
  const [createCheckoutSession, { isLoading: isRedirecting }] =
    useCreateCheckoutSessionMutation();
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

  useEffect(() => {
    if (isSuccess && salonResponse?.data) {
      dispatch(setSelectedSalon(salonResponse.data));
    }
  }, [isSuccess, salonResponse, dispatch]);

  if (!isOpen && !showSuccessModal) return null;

  const totalPrice = Array.isArray(info.services)
    ? info.services.reduce((acc, s) => acc + (s.price || 0), 0)
    : 0;
  const vmbFee = totalPrice * 0.1;
  // const handleAccept = async () => {
  //   if (!giftId) return;

  //   const loadingToast = toastLoading("Processing your payment...");
  //   try {
  //     await acceptGift({
  //       id: giftId,
  //       data: gift,
  //     }).unwrap();

  //     toastDismiss(loadingToast);
  //     toastSuccess("Payment successful! Treat accepted.");
  //     closeModal();
  //     setTimeout(() => setShowSuccessModal(true), 300);
  //   } catch (err) {
  //     toastDismiss(loadingToast);
  //     toastError(err?.data?.message || "Failed to accept gift");
  //   }
  // };
  const handleAccept = async () => {
    if (!giftId || !salonId || !info.services || info.services.length === 0) {
      toastError("Invalid gift request data");
      return;
    }

    const serviceTotal = info.services.reduce(
      (acc, s) => acc + (s.price || 0),
      0
    );
    const vmbFee = serviceTotal * 0.1;
    const totalAmount = serviceTotal + vmbFee;

    const serviceIds = info.gift.services.map((s) => s._id).filter(Boolean);

    if (serviceIds.length === 0) {
      toastError("No valid services found");
      return;
    }
    const payload = {
      salonId,
      services: serviceIds,
      clientName: info.sender.name || "Gift Recipient",
      paymentAmount: Number(totalAmount.toFixed(2)),
      id: giftId,
      paymentType: "gift",
      receiverEmail: info.gift.receiverEmail,
      requesterEmail: info.sender.email,
      requesterId: info?.gift?.requesterId?._id,
    };

    const loadingToast = toastLoading("Redirecting to secure payment...");

    try {
      const response = await createCheckoutSession(payload).unwrap();

      toastDismiss(loadingToast);

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toastError("Failed to start payment");
      }
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Payment could not be initiated");
      console.error("Stripe checkout error:", err);
    }
  };
  const handleDecline = async () => {
    if (!giftId) return;

    const loadingToast = toastLoading("Declining request...");
    try {
      await rejectGift(giftId).unwrap();
      toastDismiss(loadingToast);
      toastSuccess("Gift request declined");
      closeModal();
    } catch (err) {
      toastDismiss(loadingToast);
      toastError(err?.data?.message || "Failed to decline");
    }
  };
  const handleSeeRequests = () => {
    setShowSuccessModal(false);
    navigate("/gifts", { state: { activeTab: "receivedRequests" } });
  };

  return (
    <>
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
                <Dialog.Panel className="relative w-full max-w-[448px] transform overflow-hidden rounded-[20px] border border-vmb-primary/10 bg-vmb-bg-soft p-[30px] shadow-xl transition-all">
                  <IoClose
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-vmb-primary text-2xl cursor-pointer"
                  />

                  <div className="flex flex-col items-center">
                    <img
                      src={treatRequestIcon}
                      alt="Treat"
                      className="w-[77px] h-[76px] object-cover "
                    />
                    <h2 className="text-vmb-primary font-bold text-[22px] mt-3 text-center">
                      {gift.status === "accepted"
                        ? "Treat Confirmed!"
                        : "You’ve a Treat Request!"}
                    </h2>
                    <p className="text-vmb-text-muted/50 text-[12px] text-center mt-2">
                      {gift.status === "accepted"
                        ? "Your payment was successful. The salon has been notified and the treat is confirmed."
                        : "A friend wants you to treat them! Check the details below and complete the payment to confirm."}
                    </p>
                  </div>

                  <div className="mt-6 bg-white border border-vmb-primary/10 rounded-[10px] p-5 flex flex-col gap-4">
                    <div className="border border-vmb-primary/10 rounded-[10px] p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                        <img
                          src={info.salon.image}
                          alt="Salon"
                          className="w-[40px] h-[40px] rounded-md object-cover flex-shrink-0 border border-gray-200 "
                        />
                        <div className="min-w-0">
                          <p className="text-vmb-text-muted font-semibold text-[14px] break-words">
                            {info.salon.name}
                          </p>
                          <p className="text-vmb-text-muted text-[12px] break-words">
                            {info.salon.description}
                          </p>
                        </div>
                      </div>
                      <button
                        className="bg-vmb-secondary/30 text-vmb-primary text-[12px] rounded-[5px] px-[10px] py-[5px] w-fit self-end sm:self-auto cursor-pointer"
                        onClick={handleViewSalon}
                      >
                        View Salon
                      </button>
                    </div>

                    <div className="border border-vmb-primary/10 rounded-[10px] p-4">
                      <h3 className="text-vmb-primary text-[14px] font-medium mb-3">
                        Requested Services
                      </h3>

                      <div className="flex flex-col gap-3 max-h-[150px]  max-h-28 overflow-y-auto custom-scrollbar">
                        {info.services.map((srv, i) => (
                          <div
                            key={i}
                            className="border border-vmb-bg-soft bg-vmb-bg-soft rounded-[10px] p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 "
                          >
                            <div className="min-w-0">
                              <p className="text-vmb-primary font-medium text-[14px] break-words">
                                {srv.name}
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-[12px] text-vmb-primary">
                                <IoTimeOutline className="text-vmb-secondary text-[12px]" />
                                <span>{srv.duration}</span>
                              </div>
                            </div>
                            <p className="text-vmb-primary font-semibold text-[16px] text-right sm:text-left">
                              ${srv.price}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col items-end mt-3">
                        <p className="text-vmb-secondary font-bold text-[18px] text-right sm:text-left">
                          Total Price: ${totalPrice + vmbFee}
                        </p>
                      </div>
                    </div>

                    <div className="border border-vmb-primary/10 bg-vmb-bg-soft rounded-[10px] p-4">
                      <p className="text-vmb-primary text-[14px] font-medium mb-2">
                        Message from:
                      </p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                        {/* <img
                          src={info.sender.avatar}
                          alt="Sender"
                          className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0"
                        /> */}
                        <div className="min-w-0">
                          <p className="text-vmb-text-muted font-semibold text-[14px] break-words">
                            {info.sender.name}
                          </p>
                          <p className="text-vmb-text-muted text-[12px] break-words">
                            {info.sender.email}
                          </p>
                        </div>
                      </div>

                      <div className="border border-vmb-primary/10 bg-white rounded-[8px] p-3">
                        <p className="text-vmb-text-muted/50 text-[12px] italic leading-[18px] break-words">
                          {info.sender.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  {gift.status === "pending" && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <AppButton
                        leftIcon={<FaTimes className="text-[14px]" />}
                        variant="primary"
                        size="custom"
                        onClick={handleDecline}
                        className="text-[14px] font-medium px-5 py-[15px]"
                        disabled={rejecting}
                      >
                        {rejecting ? "Declining..." : "Decline"}
                      </AppButton>
                      <AppButton
                        leftIcon={<FaCheck className="text-[14px]" />}
                        variant="outline-dark"
                        size="custom"
                        // disabled={accepting}
                        disabled={isRedirecting}
                        onClick={handleAccept}
                        className="text-[14px] font-medium px-5 py-[15px]"
                      >
                        {/* {accepting ? "Processing..." : "Accept & Pay"} */}
                        {isRedirecting ? "Redirecting..." : "Accept & Pay"}
                      </AppButton>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={showSuccessModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 font-poppins"
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
            <Dialog.Panel className="bg-white rounded-[10px] p-[30px] flex flex-col items-center gap-3 w-full max-w-[444px] text-center">
              <img
                src={successGif}
                alt="Success"
                className="w-[96px] h-[96px] object-contain"
              />
              <h2 className="text-vmb-secondary font-bold text-[20px] mt-2">
                Payment Successful!
              </h2>
              <p className="text-vmb-text-main text-[14px] font-medium mt-1 leading-[20px]">
                All set! Your payment is done — let them enjoy their special
                treat! ✨
              </p>

              <AppButton
                fullWidth={false}
                variant="primary"
                size="custom"
                onClick={handleSeeRequests}
                className="mt-4 text-[14px] font-medium px-5 py-[15px]"
              >
                See All Requests
              </AppButton>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default TreatRequestModal;
