import React from "react";

import InviteCard from "./InviteCard";
import AppointmentCard from "./AppointmentCard";
import ServiceCard from "./ServiceCard";
import QuickInvitePanel from "./QuickInvitePanel";
import SalonProfilePanel from "./SalonProfilePanel";

import { FaUser } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import SectionWrapper from "./SectionWrapper";

function MainSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionWrapper className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaUser className="text-[#FF92A5] w-[16px] h-[20px]" />
                <p className="text-[18px] font-semibold text-[#581838]">
                  Invites
                </p>
              </div>

              <p className="underline text-[14px] font-medium text-[#9CA3AF] cursor-pointer">
                View All
              </p>
            </div>

            <InviteCard
              salon="Luxe Beauty Salon"
              service="Premium Beauty Services"
              statusText="Pending"
              statusColor="#FF9500"
              timeAgo="2 Days ago"
            />
          </SectionWrapper>

          <SectionWrapper className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-[#FF92A5] w-[18px] h-[18px]" />
                <p className="text-[18px] font-semibold text-[#581838]">
                  Pending Appointments
                </p>
              </div>

              <p className="underline text-[14px] font-medium text-[#9CA3AF] cursor-pointer">
                View All
              </p>
            </div>

            <AppointmentCard
              icon={<FaUser className="text-[#FF92A5]" />}
              from="Mike Davis"
              service="Luxury Spa Package"
              price="$85"
              statusText="Confirm"
              statusColor="#4FCF00"
              timeAgo="2 Days ago"
            />

            <AppointmentCard
              icon={<FaUser className="text-[#FF92A5]" />}
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
          <div className="flex items-center justify-between">
            <p className="text-[18px] font-semibold text-[#581838]">Services</p>

            <button className="border border-[#E5E7EB] bg-[#FF92A5] text-white rounded-[8px] px-4 py-2 text-[16px]">
              Manage Services
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <ServiceCard
              icon={<FaUser className="text-[#FF92A5]" />}
              title="Hair Cut & Style"
              desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              price="$40"
            />

            <ServiceCard
              icon={<FaUser className="text-[#FF92A5]" />}
              title="Facial Treatment"
              desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              price="$45"
            />

            <ServiceCard
              icon={<FaUser className="text-[#FF92A5]" />}
              title="Glow Treatment"
              desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
              price="$35"
            />

            <ServiceCard
              icon={<FaUser className="text-[#FF92A5]" />}
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
