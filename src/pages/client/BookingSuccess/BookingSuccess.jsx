import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import successGif from "../../../assets/successGif.gif";

import { useCreateAppointmentAfterPaymentMutation } from "../../../store/api";
import { toastError } from "../../../utils/toast";

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  const [createAppointmentAfterPayment, { isLoading }] =
    useCreateAppointmentAfterPaymentMutation();

  const [status, setStatus] = useState("verifying");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      toastError("Invalid payment session");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await createAppointmentAfterPayment({
          sessionId,
        }).unwrap();
        console.log("Response==>", response.data);
        setDetails(response.data.appointment);
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-6"></div>
          <p className="text-xl font-medium text-gray-700">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">✕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't verify your payment. Please try again or contact
            support.
          </p>
          <button
            onClick={() => navigate("/client")}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-xl transition"
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
    0
  );
  const amountPaid = isGift
    ? totalAmount + totalAmount * 0.1
    : totalAmount + 2.5;
  const salon = details?.Salon || {};
  const appointmentDate = details?.appointmentDate;
  // ? format(new Date(details.appointmentDate), "EEEE, MMMM d, yyyy")
  //   convertTo12Hour(details.appointmentDate)
  // : null;
  const appointmentTime = details?.startTime || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-10 text-center">
            <img
              src={successGif}
              alt="Success"
              className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-white shadow-lg"
            />
            <h1 className="text-4xl font-bold text-white mb-3">
              {isGift ? "Treat Paid Successfully! 🎁" : "Appointment Booked!"}
            </h1>
            <p className="text-pink-100 text-lg">
              {isGift
                ? "Your friend will be thrilled! The treat is now confirmed."
                : "Your booking is confirmed. We’ve sent details to the salon."}
            </p>
          </div>

          <div className="p-10">
            <div className="flex items-center gap-5 mb-8 p-6 bg-gray-50 rounded-2xl">
              <img
                src={salon.image || salon.profilePic || "/default-salon.jpg"}
                alt={salon.name}
                className="w-20 h-20 rounded-xl object-cover shadow-md"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {salon.name || salon.salonName}
                </h3>
                <p className="text-gray-600">
                  {salon.description || "Premium Beauty Services"}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Services Booked
              </h3>
              <div className="space-y-4">
                {services.map((service, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {service.name || service.serviceName}
                      </p>
                      {service.duration && (
                        <p className="text-sm text-gray-600">
                          {service.duration} min
                        </p>
                      )}
                    </div>
                    <p className="text-xl font-bold text-pink-600">
                      ${service.price || service.servicePrice}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {!isGift && (appointmentDate || appointmentTime) && (
              <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Appointment Details
                </h3>
                {appointmentDate && (
                  <p className="text-lg text-gray-700">📅 {appointmentDate}</p>
                )}
                {appointmentTime && (
                  <p className="text-lg text-gray-700 mt-2">
                    🕒 {appointmentTime}
                  </p>
                )}
              </div>
            )}

            <div className="bg-gray-900 text-white rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-5">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    $
                    {services
                      .reduce(
                        (sum, s) =>
                          sum + (Number(s.price || s.servicePrice) || 0),
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                {/* <div className="flex justify-between text-pink-300">
                  <span>VMB {isGift ? "Gift Fee (10%)" : "Platform Fee"}</span>
                  <span>
                    ${" "}
                    {isGift ? (totalAmount * 0.1).toFixed(2) : (2.5).toFixed(2)}
                  </span>
                </div> */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total Paid</span>
                    <span className="text-pink-400">
                      ${amountPaid.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => navigate("/client")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg transition transform hover:scale-105"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-10 text-sm">
          A confirmation has been sent to your email. Thank you for choosing
          VMB! 💖
        </p>
      </div>
    </div>
  );
}
