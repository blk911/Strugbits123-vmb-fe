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
    <div className="flex flex-col items-center bg-vmb-bg-soft gap-[60px] px-4 py-6">
      <HeroSection />
      <LogoMarquee />
      <PlatformBenefits
        heading={"Turn Attention Into Clients, Loyalty and Recurring Revenue"}
        subheading={
          "VMB turns your social into an invite-only client network — where trust drives who shows up, who pays, and who brings others."
        }
        cards={[
          {
            photo: priorityImg,
            title: "Revenue",
            desc: "VMB converts attention into prepaid clients through trust — not ads or discounts.",
          },
          {
            photo: loyaltyImg,
            title: "Trust",
            desc: "Every client invite is personal, trust makes every client intentional and priceless.",
          },
          {
            photo: advocateImg,
            title: "Growth",
            desc: "Clients don't just come — they invite, share, and expand your network.",
          },
        ]}
      />
      <GiftsAndInvite
        cards={[
          {
            title: "Two is Fun. Three is a celebration.",
            desc: "Turn loyal clients into new bookings - invite them to schedule with a friend or request a gift from someone special.",
            btnText: "Send or Request Style Gifts",
            type: "salon",
            mode: "signup",
          },
          {
            title: "Your Clients Already Have Favorite Salons — VMB Gets You Inside",
            desc: "Your clients trust you and their favorites for Nails. Hair. Skin. Wax. and more. VMB places you inside that trusted circle — so clients connect you to their trusted relationships, friends, and favorites.",
            btnText: "Connect With the Salons Your Clients Love",
            type: "salon",
            mode: "signup",
          },
        ]}
      />
      <SalonChoice
        blocks={[
          {
            label: "SALON OWNERS",
            title: "How VMB Turns Attention Into Revenue",
            descriptionBlock: [
              {
                heading: "Capture Attention",
                text: "You're already getting views, likes, and DMs. VMB captures that attention and gives it a path to convert.",
              },
              {
                heading: "Turn Attention Into Trusted Clients",
                text: "Clients don't come in cold — they arrive through people they already trust.",
              },
              {
                heading: "Drive Prepaid, Intent-Based Visits",
                text: "Clients commit before they show up — creating reliable, higher-quality appointments.",
              },
              {
                heading: "Expand Through Client Networks",
                text: "Clients don't come alone — they bring others through shared trust and relationships.",
              },
              {
                heading: "Grow Through Connected Salons",
                text: "You connect with the salons your clients already love — creating a shared network that drives referrals across services.",
              },
            ],
            buttonText: "Register Your Salon Today",
            authMode: "signup",
            authType: "salon",
          },
          {
            label: "FOR YOUR CLIENTS",
            title: "VMB fits your Clients Lifestyle",
            introText:
              "Your clients don't just book — they engage, share, and bring others in.",
            bulletPoints: [
              "Schedule together with people they trust",
              "Send services as gifts to friends and family",
              "Share their favorite salons with friends",
              "Discover new services through their trusted salon relationships",
              "Your network grows as your client network grows",
            ],
            outroText: "This is what turns clients into your growth engine.",
            buttonText: "Activate Your Client Network",
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
