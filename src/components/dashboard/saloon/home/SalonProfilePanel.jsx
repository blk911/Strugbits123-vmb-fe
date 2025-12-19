import SectionWrapper from "./SectionWrapper";
import {
  FaEdit,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaCalendar,
} from "react-icons/fa";
import salonImg from "../../../../assets/salon-4.png";
import AppButton from "../../../common/site/AppButton";
import { useDashboardModal } from "../../../../pages/ModalProvider";
import { salons as salonsData } from "../../client/Home/mockData";
import { useUser } from "../../../../hooks/useUser";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

export default function SalonProfilePanel() {
  const { openModal } = useDashboardModal();
  const { user, loading } = useUser();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (!user) return null;
  const salon = salonsData[0];
  return (
    <SectionWrapper className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[18px] font-semibold text-[#581838]">
          Salon Profile
        </p>
        <FaEdit
          className="text-[#FF92A5] shrink-0 cursor-pointer"
          onClick={() => openModal("salonprofileSettings")}
        />
      </div>

      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-[80px] h-[80px] rounded-full border border-[#E5E7EB] overflow-hidden">
          <img
            src={user?.profilePic || salonImg}
            alt="Salon"
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-[18px] font-semibold text-[#581838]">
          {user?.salonName}
        </p>
        <p className="text-[14px] text-[#4B5563]">{user?.description}</p>
      </div>

      <div className="flex flex-col gap-3 ">
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-[#9CA3AF] shrink-0" />
          <p className="text-[14px] text-[#4B5563]">
            {user?.address}, {user?.zipcode}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaPhone className="text-[#9CA3AF] shrink-0" />
          <p className="text-[14px] text-[#4B5563]">{user?.phoneNumber}</p>
        </div>

        <div className="flex items-center gap-3">
          <FaClock className="text-[#9CA3AF]  shrink-0" />
          <p className="text-[14px] text-[#4B5563]">
            {user?.startTime && user?.endTime
              ? `${user.startTime} - ${user.endTime}`
              : "09:00 AM - 05:00 PM"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaCalendar className="text-[#9CA3AF] shrink-0" />
          <p className="text-[14px] text-[#4B5563]">
            {" "}
            {user?.workingDays.map((day) => day.slice(0, 3)).join("-")}
          </p>
        </div>
      </div>

      <AppButton
        variant="primary"
        size="custom"
        className="text-[16px] font-medium  py-2 "
        onClick={() => openModal("salonprofileSettings")}
      >
        Edit Profile
      </AppButton>
    </SectionWrapper>
  );
}
