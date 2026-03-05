import { useNavigate } from "react-router-dom";
import declineGif from "../../../assets/declineGif.gif";
import AppButton from "../../../components/common/site/AppButton";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function BookingCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-vmb-bg-soft px-4 font-poppins">
      <div className="w-full max-w-[547px]">
        <div className="bg-white flex flex-col items-center gap-4 p-6 sm:p-8 rounded-3xl shadow-2xl text-center">
          <img
            src={declineGif}
            alt="Booking Cancelled"
            className="w-32 h-32 mb-4"
          />

          <h1 className="text-[24px] font-bold text-vmb-primary">
            Booking Cancelled
          </h1>

          <p className="text-vmb-text-muted text-[14px] leading-relaxed">
            Your booking has been successfully cancelled.
            <br />
            If this was a mistake, you’re always welcome to book again.
          </p>

          <AppButton
            onClick={() => navigate("/client")}
            variant="outline-dark"
            leftIcon={<FaArrowLeftLong size={16} />}
            className="mt-4 text-[14px] sm:text-[16px]"
          >
            Back to Dashboard
          </AppButton>
        </div>
      </div>
    </div>
  );
}
