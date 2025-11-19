import React from "react";

import InviteCard from "./InviteCard";
import AppointmentCard from "./AppointmentCard";
import ServiceCard from "./ServiceCard";
import QuickInvitePanel from "./QuickInvitePanel";
import SalonProfilePanel from "./SalonProfilePanel";
import salonImg from "../../../../assets/salon-4.png";
import { FaUser } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import SectionWrapper from "./SectionWrapper";
import defaultUser from "../../../../assets/user_icon.png";
function MainSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <SectionWrapper className="p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <FaUser className="text-[#FF92A5] w-[16px] h-[20px] shrink-0" />
                <p className="text-[18px] font-semibold text-[#581838]">
                  Invites
                </p>
              </div>

              <p className="underline text-[14px] font-medium text-[#9CA3AF] cursor-pointer text-center sm:text-right">
                View All
              </p>
            </div>

            <InviteCard
              img={defaultUser}
              salon="Luxe Beauty Salon"
              service="Premium Beauty Services"
              statusText="Pending"
              statusColor="#FF9500"
              timeAgo="2 Days ago"
            />
          </SectionWrapper>

          <SectionWrapper className="p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center justify-center sm:justify-start gap-3 ">
                <FaCalendarAlt className="text-[#FF92A5] w-[18px] h-[18px] shrink-0" />
                <p className="text-[18px] font-semibold text-[#581838]">
                  Pending Appointments
                </p>
              </div>

              <p className="underline text-[14px] font-medium text-[#9CA3AF] cursor-pointer text-center sm:text-right">
                View All
              </p>
            </div>

            <AppointmentCard
              icon={defaultUser}
              from="Mike Davis"
              service="Luxury Spa Package"
              price="$85"
              statusText="Confirm"
              statusColor="#4FCF00"
              timeAgo="2 Days ago"
            />

            <AppointmentCard
              icon={defaultUser}
              from="Mike Davis"
              service="Luxury Spa Package"
              price="$85"
              statusText="Reschedule"
              statusColor="#FF92A5"
              timeAgo="2 Days ago"
            />
          </SectionWrapper>
        </div>

        <SectionWrapper className="p-6 flex flex-col gap-6">
          <div className="flex  flex-col sm:flex-row  items-center justify-between">
            <p className="text-[18px] font-semibold text-[#581838]">Services</p>

            <button className="border border-[#E5E7EB] bg-[#FF92A5] text-white rounded-[8px] px-4 py-2 text-[16px]">
              Manage Services
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <ServiceCard
              img={salonImg}
              title="Hair Cut & Style"
              desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              price="$40"
            />

            <ServiceCard
              img={salonImg}
              title="Facial Treatment"
              desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              price="$45"
            />

            <ServiceCard
              img={salonImg}
              title="Glow Treatment"
              desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              price="$35"
            />

            <ServiceCard
              img={salonImg}
              title="Standard Facial"
              desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              price="$20"
            />
          </div>
        </SectionWrapper>
      </div>

      <div className="lg:col-span-1 flex flex-col gap-6">
        <QuickInvitePanel />

        <SalonProfilePanel />
      </div>
    </div>
  );
}

export default MainSection;
