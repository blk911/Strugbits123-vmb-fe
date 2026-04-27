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
        heading={"VMB Fits Your Lifestyle: Trust, Loyalty and Friends"}
        subheading={""}
        cards={[
          {
            photo: priorityImg,
            title: "Go Where Your People Go",
            desc: "You don't guess — you follow what you trust. VMB connects you to the salons your circle already loves.",
          },
          {
            photo: loyaltyImg,
            title: "Share What You Love",
            desc: "Bring friends. Book together. Send services. What you already do becomes a shared experience.",
          },
          {
            photo: advocateImg,
            title: "Get Something Back",
            desc: "When you share what you love, it comes back to you — in real value and better experiences.",
          },
        ]}
      />
      <GiftsAndInvite
        cards={[
          {
            title: "Did someone say “Party”!",
            desc: "You love putting your people onto the best and they love sharing their fav's. VMB makes it count — bringing value back to you, and elevating the experience for everyone in your circle.",
            btnText: "Invite your GFs, get the party started",
            type: "customer",
            mode: "signup",
          },
          {
            title: "It's Not Just a Gift — It's Personal",
            desc: "For the Moments That Matter — for the ones you Love. Birthday. Celebration. Or a quiet “thinking of you.” VMB makes it effortless to send something meaningful — a moment of care, confidence, or reset she'll actually feel.",
            type: "customer",
            mode: "signup",
          },
        ]}
      />
      <SalonChoice
        blocks={[
          {
            label: "VMB CLIENTS",
            title: "How VMB Works For You",
            descriptionBlock: [
              {
                heading: "Book With Intention",
                text: "Lock in the time and service you want — prepaid, confirmed, and set.",
              },
              {
                heading: "Send Something She'll Actually Use",
                text: "Gift services that matter — easy to send, easy to redeem, always relevant.",
              },
              {
                heading: "Get More From What You Already Do",
                text: "When you come back or bring someone new, you get real value back — not points, or credits you'll never use.",
              },
              {
                heading: "Better Access, Better Experiences",
                text: "The more you use VMB, the more it works for you — better access, better experiences, and value that comes back to you — including cash you can spend",
              },
            ],
            buttonText: "Register Your Salon Today",
            authMode: "signup",
            authType: "salon",
          },
          {
            label: "CO-MARKETING PROGRAM",
            title: "Use VMB With Your People — Get More From It",
            introText:
              "Invite your friends. Send a service. Plan something together. Skip the back-and-forth — it's set, prepaid, and real.",
            bulletPoints: [
              "When they show up, you benefit.",
              "Value comes back to you.",
              "Experiences get better over time.",
            ],
            outroText: "No points. No gimmicks. Just more from what you already do.",
            buttonText: "Start With Your Besties",
            authMode: "signup",
            authType: "customer",
          },
        ]}
      />
      <SalonExperience
        heading={"Ready to Make VMB Work for You?"}
        primaryButtonText={"Activate your network"}
        primaryAuthType={"customer"}
        secondaryButtonText={"Gift Your First Service"}
        secondaryAuthType={"customer"}
      />
      <TopSalons />
    </div>
  );
}

export default Home;
