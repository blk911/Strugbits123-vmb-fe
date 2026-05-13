import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthMode, setAuthType } from "../../store/features/authSlice";
import mothersImg from "../../assets/brand/benefits/girls-night.jpg";
import bridalImg from "../../assets/salon-experience.png";
import vipImg from "../../assets/brand/benefits/priority.png";
import friendImg from "../../assets/brand/benefits/invite_sent.jpeg";

const EXPERIENCES = [
  {
    id: "mothers",
    title: "Mother's Day Reset",
    copy: "Gift a luxury reset to someone who gives everything to everyone else.",
    cta: "Send Gift",
    image: mothersImg,
    action: "scroll-gifts",
  },
  {
    id: "bridal",
    title: "Bridal Circle Access",
    copy: "Reserve a private beauty lane for the people standing closest to her.",
    cta: "Build Bridal Circle",
    image: bridalImg,
    action: "register",
  },
  {
    id: "vip",
    title: "VIP Signature Set",
    copy: "Invite your best clients into a curated experience built around trust, loyalty, and access.",
    cta: "Request Invite",
    image: vipImg,
    action: "register",
  },
  {
    id: "friend",
    title: "Best Friend Gift Drop",
    copy: "Make it easy for clients to send something beautiful to the women they love.",
    cta: "Create Gift Drop",
    image: friendImg,
    action: "scroll-gifts",
  },
];

function ExperienceCard({ item, onCta }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-[#fefdfb]/95 shadow-[0_4px_24px_-8px_rgba(15,61,62,0.12)] transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(15,61,62,0.18)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200/60">
        <img
          src={item.image}
          alt=""
          className="h-full w-full object-cover transition duration-[1.1s] ease-out group-hover:scale-[1.05]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f3d3e]/35 via-transparent to-transparent opacity-80" />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6 sm:pt-6">
        <h3 className="font-studio-serif text-xl font-medium leading-snug tracking-tight text-[#0f3d3e] sm:text-[1.35rem]">
          {item.title}
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stone-600">
          {item.copy}
        </p>
        <button
          type="button"
          onClick={() => onCta(item.action)}
          className="mt-6 w-full rounded-xl bg-[#F7E7CE] px-5 py-3 text-center text-sm font-semibold tracking-wide text-[#1a2820] shadow-[0_2px_12px_-4px_rgba(247,231,206,0.9)] transition hover:brightness-[1.03] active:scale-[0.99] sm:w-auto sm:self-start sm:px-6"
        >
          {item.cta}
        </button>
      </div>
    </article>
  );
}

export default function SalonFeaturedExperiences() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const scrollToId = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const goRegisterSalon = useCallback(() => {
    dispatch(setAuthType("salon"));
    dispatch(setAuthMode("signup"));
    navigate("/register");
  }, [dispatch, navigate]);

  const onCta = useCallback(
    (action) => {
      if (action === "register") goRegisterSalon();
      else scrollToId("salon-gift-flow");
    },
    [goRegisterSalon, scrollToId],
  );

  return (
    <section
      id="salon-gifts-invite"
      className="relative w-full scroll-mt-6 overflow-hidden bg-gradient-to-b from-[#1a2332] via-[#252f3d] to-[#ebe6dc] py-16 sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(247,231,206,0.09),transparent_55%)]"
        aria-hidden
      />
      <div className="relative z-[1] mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#F7E7CE]/55">
            Private access
          </p>
          <h2 className="font-studio-serif mt-3 text-3xl font-medium leading-tight tracking-tight text-[#faf7f0] sm:text-4xl lg:text-[2.5rem]">
            Featured Experiences
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#d8d2c8] sm:text-lg">
            Private gifts, VIP access, and curated salon moments designed to
            move through trusted client circles.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {EXPERIENCES.map((item) => (
            <ExperienceCard key={item.id} item={item} onCta={onCta} />
          ))}
        </div>
      </div>
    </section>
  );
}
