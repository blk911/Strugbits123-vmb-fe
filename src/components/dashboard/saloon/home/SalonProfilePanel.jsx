import { FaEdit, FaMapMarkerAlt, FaPhone, FaClock, FaCalendar } from "react-icons/fa";
import salonImg from "../../../../assets/salon-4.png";
import AppButton from "../../../common/site/AppButton";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { useUser } from "../../../../hooks/useUser";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import SectionWrapper from "./SectionWrapper";

const DAYS_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function SalonProfilePanel() {
  const { openModal } = useDashboardModal();
  const { user, loading } = useUser();

  if (loading) {
    return (
      <SectionWrapper className="p-6 flex items-center justify-center min-h-[200px]">
        <LoadingIndicator />
      </SectionWrapper>
    );
  }
  if (!user) return null;

  const workingDays = (() => {
    const current = user?.workingDays || [];
    if (!current.length) return "No working days set";
    return DAYS_ORDER.filter((d) => current.includes(d))
      .map((d) => d.slice(0, 3))
      .join(" · ");
  })();

  return (
    <SectionWrapper className="p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-poppins font-semibold tracking-[0.18em] uppercase"
          style={{ color: "var(--vmb-gold)" }}
        >
          Salon Profile
        </span>
        <FaEdit
          className="w-[14px] h-[14px] cursor-pointer transition hover:opacity-70"
          style={{ color: "var(--vmb-secondary)" }}
          onClick={() => openModal("salonprofileSettings")}
        />
      </div>

      <div className="flex flex-col items-center text-center gap-3">
        <div
          className="w-[72px] h-[72px] rounded-full overflow-hidden"
          style={{ border: "2px solid var(--vmb-border-light)" }}
        >
          <img
            src={user?.profilePic || salonImg}
            alt="Salon"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p
            className="font-playfair text-[20px] leading-tight"
            style={{ color: "var(--vmb-primary)" }}
          >
            {user?.salonName}
          </p>
          {user?.description && (
            <p className="text-[13px] font-inter mt-1 line-clamp-2" style={{ color: "var(--vmb-text-muted)" }}>
              {user.description}
            </p>
          )}
        </div>
      </div>

      <div
        className="h-px"
        style={{ background: "var(--vmb-border-light)" }}
      />

      <div className="flex flex-col gap-2.5">
        {[
          { Icon: FaMapMarkerAlt, text: [user?.address, user?.zipcode].filter(Boolean).join(", ") },
          { Icon: FaPhone, text: user?.phoneNumber },
          { Icon: FaClock, text: user?.startTime && user?.endTime ? `${user.startTime} – ${user.endTime}` : "09:00 AM – 05:00 PM" },
          { Icon: FaCalendar, text: workingDays },
        ].map(({ Icon, text }) =>
          text ? (
            <div key={text} className="flex items-start gap-2.5">
              <Icon
                className="w-[13px] h-[13px] mt-[3px] shrink-0"
                style={{ color: "var(--vmb-gold)" }}
              />
              <span className="text-[13px] font-poppins leading-snug" style={{ color: "var(--vmb-text-muted)" }}>
                {text}
              </span>
            </div>
          ) : null
        )}
      </div>

      <AppButton
        variant="primary"
        size="custom"
        className="text-[14px] font-medium py-2 mt-1"
        onClick={() => openModal("salonprofileSettings")}
      >
        Edit Profile
      </AppButton>
    </SectionWrapper>
  );
}
