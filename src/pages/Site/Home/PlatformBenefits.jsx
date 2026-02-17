import React from "react";
import empowerImg from "../../../assets/brand/benefits/empower.png";
import personalImg from "../../../assets/brand/benefits/personal.png";
import connectionImg from "../../../assets/brand/benefits/connection.png";

function Card({ photo, title, desc }) {
  return (
    <div className="vmb-card h-full flex flex-col items-center text-center p-6 sm:p-7 hover:shadow-sm transition-shadow">
      <div className="vmb-photo group vmb-photo-hover h-24 w-24 mx-auto mb-4 hover:-translate-y-0.5">
        <img
          className="vmb-photo-img"
          src={photo}
          alt={title}
          loading="lazy"
          decoding="async"
        />
        <div className="vmb-photo-overlay group-hover:opacity-65" />
      </div>
      <span className="mt-5 mb-2 text-xl sm:text-2xl font-semibold vmb-title">
        {title}
      </span>
      <span className="text-sm sm:text-base leading-relaxed vmb-muted">
        {desc}
      </span>
    </div>
  );
}

function PlatformBenefits() {
  return (
    <section className="w-full pt-4 pb-8 sm:pt-6 sm:pb-10">
      <div className="vmb-container text-center">
        <h3 className="vmb-h2 vmb-title capitalize font-semibold">
          A New Model For Modern Salons
        </h3>
        <p className="mt-2 text-sm sm:text-base vmb-muted font-medium">
          Success needs a system — VMB simplifies success.
        </p>
        <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          <Card
            photo={empowerImg}
            title="Empowering"
            desc="Replace cancellations with committed clients — and fill empty chairs through intentional invitations."
          />
          <Card
            photo={personalImg}
            title="Personal"
            desc="Experience beauty through personal invitations — designed with intention."
          />
          <Card
            photo={connectionImg}
            title="Connection"
            desc="Build long-term relationships that grow through trust, referrals, and repeat visits."
          />
        </div>
      </div>
    </section>
  );
}

export default PlatformBenefits;
