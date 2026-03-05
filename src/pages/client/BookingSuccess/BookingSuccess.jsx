import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import successGif from "../../../assets/successGif.gif";

import { useCreateAppointmentAfterPaymentMutation } from "../../../store/api";
import { toastError } from "../../../utils/toast";
import { FaRegClock, FaRegCalendarAlt } from "react-icons/fa";
import AppButton from "../../../components/common/site/AppButton";
import { FaArrowLeftLong } from "react-icons/fa6";
import LoadingIndicator from "../../../components/common/LoadingIndicator/LoadingIndicator";
export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const hasCalledRef = useRef(false);
  const [createAppointmentAfterPayment, { isLoading }] =
    useCreateAppointmentAfterPaymentMutation();

  const [status, setStatus] = useState("verifying");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!sessionId || hasCalledRef.current) return;

    hasCalledRef.current = true;
    const verifyPayment = async () => {
      try {
        const response = await createAppointmentAfterPayment({
          sessionId,
        }).unwrap();
        setDetails(response?.data?.appointment);
        setStatus("success");
      } catch (err) {
        console.error(err);
        toastError(err?.data?.message || "Payment verification failed");
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId, createAppointmentAfterPayment]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-vmb-bg-soft flex items-center justify-center">
        <div className=" flex flex-col items-center justify-center gap-2 text-center">
          <LoadingIndicator />
          <p className="text-xl font-medium text-vmb-text-main">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-vmb-bg-soft flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">✕</div>
          <h2 className="text-2xl font-bold text-vmb-text-main mb-3">
            Payment Failed
          </h2>
          <p className="text-vmb-text-muted mb-8">
            We couldn't verify your payment. Please try again or contact
            support.
          </p>
          <button
            onClick={() => navigate("/client")}
            className="bg-vmb-secondary hover:opacity-90 text-white font-semibold py-3 px-8 rounded-xl transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  const isGift = details?.sourceType === "gift" || details?.giftId;
  const services = details?.services || [];
  const totalAmount = details?.services.reduce(
    (sum, s) => sum + (Number(s.price || s.servicePrice) || 0),
    0,
  );
  const amountPaid =
    isGift ? totalAmount + totalAmount * 0.1 : totalAmount + 2.5;
  const salon = details?.Salon || {};
  const appointmentDate = details?.appointmentDate;
  const appointmentTime = details?.startTime || null;

  return (
    <div className="min-h-screen bg-vmb-bg-soft py-12 px-4 font-poppins">
      <div className="max-w-[547px] mx-auto">
        <div className="bg-white flex flex-col gap-4 p-6 rounded-3xl shadow-2xl overflow-hidden">
          <div className="py-2 text-center">
            <img
              src={successGif}
              alt="Success"
              className="w-32 h-32 mx-auto "
            />
            <h1 className="text-[24px] font-bold text-vmb-primary mb-3">
              {isGift ? "Treat Paid Successfully!" : "Appointment Booked"}
            </h1>
            <p className="text-vmb-text-muted text-[12px]">
              {isGift ?
                "Your friend will be thrilled! The treat is now confirmed."
              : "Your booking is confirmed. We’ve sent details to the salon."}
            </p>
          </div>
          <div className="flex justify-center items-center ">
            <div className="flex flex-col relative max-w-[467px] w-full bg-vmb-secondary/10 border border-vmb-primary/10 rounded-[10px] px-[20px] py-[15px]">
              <div className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] bg-white rounded-full" />
              <div className="absolute -right-[10px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] bg-white rounded-full" />
              {/* <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 px-[20px] pointer-events-none">
                <div className="border-t border-dashed border-vmb-primary/10" />
              </div> */}
              <div className="min-h-[237px]">
                <div className="flex gap-1 items-center mb-4">
                  <img
                    src={salon.image || salon.profilePic}
                    alt={salon.name}
                    className="w-[60px] h-[60px] rounded-[10px] border border-white/70 shadow-sm"
                  />

                  <div className="ml-1">
                    <p className="text-vmb-text-muted text-[14px] sm:text-[16px] md:text-[20px] font-semibold">
                      {salon.name}
                    </p>
                    <p className="text-vmb-text-muted text-[12px]">
                      {salon.description || "Premium Beauty Services"}
                    </p>
                  </div>
                </div>

                <p className="text-vmb-text-main text-[14px] font-medium mb-3">
                  Booked Services
                </p>
                {services.map((service) => (
                  <div className="bg-white rounded-[10px] p-[10px] flex justify-between items-center mb-4">
                    <div>
                      <p className="text-vmb-primary text-[14px] font-medium">
                        {service.name || service.serviceName}
                      </p>
                      <div className="flex items-center gap-2 text-vmb-text-muted/50 text-[12px]">
                        <FaRegClock />
                        <span> {service.duration} min</span>
                      </div>
                    </div>

                    <p className="text-vmb-primary text-[16px] font-semibold">
                      ${service.price || service.servicePrice}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-vmb-primary/20 pt-3">
                {!isGift && (appointmentDate || appointmentTime) && (
                  <>
                    <p className="text-vmb-text-main text-[14px]  mb-3 font-medium   ">
                      Appointment Details
                    </p>
                    <div className="border border-vmb-primary/10 rounded-[10px] p-[15px] flex gap-[20px] mb-4">
                      <div className="w-1/2">
                        <p className="text-vmb-text-main text-[12px] font-medium mb-1">
                          Booking Date
                        </p>
                        <div className="flex items-center gap-2 text-vmb-text-muted/50 text-[12px]">
                          <FaRegCalendarAlt />
                          <span>{appointmentDate}</span>
                        </div>
                      </div>

                      <div className="w-1/2">
                        <p className="text-vmb-text-main text-[12px] font-medium mb-1">
                          Booking Time
                        </p>
                        <div className="flex items-center gap-2 text-vmb-text-muted/50 text-[12px]">
                          <FaRegClock />
                          <span>{appointmentTime}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="border-2 bg-white border-dashed border-vmb-primary rounded-[10px] p-[9px] space-y-[10px]">
                  <p className="text-vmb-text-main text-[14px] font-medium">
                    Payment Summary
                  </p>

                  <div className="flex justify-between text-[12px] font-medium text-vmb-text-muted/50">
                    <span>Sub Total:</span>
                    <span>
                      {" "}
                      {services
                        .reduce(
                          (sum, s) =>
                            sum + (Number(s.price || s.servicePrice) || 0),
                          0,
                        )
                        .toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-vmb-text-main text-[14px] font-medium">
                      Total Paid:
                    </span>
                    <span className="text-vmb-secondary text-[16px] font-semibold">
                      $
                      {details?.sourceType === "invite" ?
                        details?.paidAmount.toFixed(2)
                      : amountPaid.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center px-[20px]">
            <AppButton
              onClick={() =>
                details?.sourceType === "gift" ?
                  navigate("/client")
                : navigate("/appointments")
              }
              variant="outline-dark"
              leftIcon={<FaArrowLeftLong size={16} />}
              className="text-[12px] sm:text-[16px]"
            >
              Back to Dashboard
            </AppButton>
          </div>
        </div>

        <p className="text-center text-vmb-text-muted mt-10 text-sm">
          A confirmation has been sent to your email. Thank you for choosing
          VMB! 💖
        </p>
      </div>
    </div>
  );
}
