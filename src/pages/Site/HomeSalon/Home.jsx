import LogoMarquee from "../../../components/common/site/Marquee";
import HeroSection from "./HeroSection";
import priorityImg from "../../../assets/brand/benefits/priority.png";
import loyaltyImg from "../../../assets/brand/benefits/loyalty.png";
import advocateImg from "../../../assets/brand/benefits/advocate.png";
import PlatformBenefits from "../Home/PlatformBenefits";
import GiftsAndInvite from "../Home/GiftsAndInvite";
import SalonExperience from "../Home/SalonExperience";
import TopSalons from "../Home/TopSalons";
import SalonChoice from "../Home/SalonChoice";
function HomeSalon() {
  return (
    <div className="flex flex-col items-center bg-vmb-bg-soft gap-[60px]">
      <HeroSection />
      <LogoMarquee />
      <PlatformBenefits
        heading={"A New Model For Modern Salons"}
        subheading={"Success needs a system - VMB simplifies success."}
        cards={[
          {
            photo: priorityImg,
            title: "Empowering",
            desc: "Replace cancellations with committed clients and fill empty chairs through international invitations.",
          },
          {
            photo: loyaltyImg,
            title: "Personal",
            desc: "Experience beauty through personal invitations designed with intention.",
          },
          {
            photo: advocateImg,
            title: "Connection",
            desc: "Build long-term relationships that grow through trust, referrals, and repeat visits.",
          },
        ]}
      />
      <GiftsAndInvite
        cards={[
          {
            title: "Two is Fun. Three is a celebration.",
            desc: "Turn loyal clients into new bookings - invite them to schedule with a friend or request a gift from someone special.",
            type: "salon",
            mode: "signup",
          },
          {
            title: "Make invitations and gifting your calling card",
            desc: "Salon owners can invite others to join and grow together.",
            type: "salon",
            mode: "signup",
          },
        ]}
      />
      <SalonChoice
        blocks={[
          {
            label: "SALON OWNERS",
            title: "How The VMB Model Works",
            descriptionBlock: [
              {
                heading: "Replace Cancellation with Commitments",
                text: "Pre-paid invitations reduce no-shows and protect your schedule.",
              },
              {
                heading: "Turn Invitations Into Revenue",
                text: "Clients invite friends, request gifted services, and book together intentionally.",
              },
              {
                heading: "Reward Loyalty That Promotes You",
                text: "Built-in incentives turn satisfied clients into active ambassadors.",
              },
              {
                heading: "Grow Through Co-Marketing",
                text: "Salons who build the network share in its growth.",
              },
            ],
            buttonText: "Register Your Salon Today",
            authMode: "signup",
            authType: "salon",
          },
          {
            label: "FOR CUSTOMERS",
            title: "Beauty Is Better Shared; Even Better Gifted!",

            bulletPoints: [
              "Schedule together",
              "Send experiences as gifts",
              "Discover salons through real relationships",
              "Benefits when your circle grows.",
            ],
            buttonText: "Create Free Account",
            authMode: "signup",
            authType: "salon",
          },
        ]}
      />
      <SalonExperience />
      <TopSalons />
    </div>
  );
}

export default HomeSalon;
