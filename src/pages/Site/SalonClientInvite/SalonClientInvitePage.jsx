import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PublicClientInvite from "../../../components/vmb/invites/PublicClientInvite";
import { getSalonLandingBySlug } from "../../../data/mockSalonLanding";

export default function SalonClientInvitePage() {
  const { id: salonSlug } = useParams();
  const salon = getSalonLandingBySlug(salonSlug);

  useEffect(() => {
    document.title = salon ? "Private Invitation · VMB" : "Salon Invitation · VMB";
    return () => {
      document.title = "VMB";
    };
  }, [salon]);

  if (!salon) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fff8f5] px-6 py-20 text-[#332a28]">
        <p className="font-studio-serif text-2xl">This invitation link is not available.</p>
        <p className="mt-3 max-w-sm text-center text-sm leading-6 text-[#765f5b]">
          Check the link you received, or ask your salon for a fresh invitation.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-[#8f5f62] px-7 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(143,95,98,0.2)] transition hover:bg-[#7b4e52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a9ac]"
        >
          Back to VMB
        </Link>
      </div>
    );
  }

  return <PublicClientInvite salon={salon} />;
}
