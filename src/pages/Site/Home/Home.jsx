import LogoMarquee from "../../../components/common/site/Marquee";
import GiftsAndInvite from "./GiftsAndInvite";
import HeroSection from "./HeroSection";
import PlatformBenefits from "./PlatformBenefits";
import SalonChoice from "./SalonChoice";
import SalonExperience from "./SalonExperience";
import TopSalons from "./TopSalons";
import priorityImg from "../../../assets/brand/benefits/priority.png";
import loyaltyImg from "../../../assets/brand/benefits/loyalty.png";
import advocateImg from "../../../assets/brand/benefits/advocate.png";
function Home() {
  return (
    <div className="flex flex-col items-center bg-vmb-bg-soft gap-[60px] px-4 py-6">
      <HeroSection />
      <LogoMarquee />
      <PlatformBenefits
        heading={"A New Model For Modern Salons"}
        subheading={"Success needs a system - VMB simplifies success."}
        cards={[
          {
            photo: priorityImg,
            title: "Priority",
            desc: (
              <>
                VMB members enjoy better access, <br />
                smoother scheduling, and a <br />
                relationship built on mutual respect.
              </>
            ),
          },
          {
            photo: loyaltyImg,
            title: "Loyalty",
            desc: (
              <>
                It's shared trust over time. VMB rewards <br />
                that trust with upgrades, credits, and <br />
                thoughtful perks designed to make every <br />
                appointment feel even better.
              </>
            ),
          },
          {
            photo: advocateImg,
            title: "Advocate",
            desc: (
              <>
                Share the salon you trust. VMB
                <br />
                converts referrals into earned credits <br />
                and exclusive upgrades - built to <br />
                reward loyalty.
              </>
            ),
          },
        ]}
      />
      <GiftsAndInvite
        cards={[
          {
            title: "Did someone say “Party”!",
            desc: "You love sharing the best finds. VMB makes it easy to turn those moments into something more - with earned credits, exclusive upgrades, and thoughtful perks for you and your friends.",
            type: "customer",
            mode: "signup",
          },
          {
            title: "Gifts and Personal Invitations are Personal, Intentional.",
            desc: "There are moments when you or someone special needs a little attention, a confidence booster, a timely reset. VMB makes it effortless to give and receive the glam, the refresh, or the rest she'll actually love - secure, thoughtful, and easy to use.",
            type: "customer",
            mode: "signup",
          },
        ]}
      />
      <SalonChoice
        blocks={[
          {
            label: "VMB CLIENTS",
            title: "How The VMB Model Works",
            descriptionBlock: [
              {
                heading: "Secure Your Spot With Confidence",
                text: "Commitment-based invitations reduce last-minute chaos and protect the time you count on.",
              },
              {
                heading: "Turn Invitations Into Revenue",
                text: "Invite friends, request gifted services, or book intentionally - and unlock credits and exclusive upgrades.",
              },
              {
                heading: "Be Rewarded for Loyalty",
                text: "Your repeat visits and referrals earn tangible rewards, not just points - real value you can use.",
              },
              {
                heading: "Build Your Co-Marketing Account",
                text: "As the network grows, so do your perks - giving you better access and member-only advantages.",
              },
            ],
            buttonText: "Register Your Salon Today",
            authMode: "signup",
            authType: "salon",
          },
          {
            label: "CO-MARKETING PROGRAM",
            title: "Your Circle Grows, You Benefit.",
            bulletPoints: [
              "Join VMB and secure your place in the network.",
              "Invite friends to schedule or receive gifts.",
              "When they book, your circle expands.",
              "As the network grows, so do your member rewards.",
            ],
            buttonText: "Create Free Account",
            authMode: "signup",
            authType: "customer",
          },
        ]}
      />
      <SalonExperience />
      <TopSalons />
    </div>
  );
}

export default Home;
