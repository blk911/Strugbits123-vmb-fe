import { FaGift, FaPaperPlane } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import GiftCard from "./GiftCard";
import {
  useRecievedGiftsQuery,
  useRequestedGiftsQuery,
} from "../../../../store/api";

export default function GiftCardsSection() {
  const { data } = useRecievedGiftsQuery({ refetchOnMountOrArgChange: true });
  const { data: requests } = useRequestedGiftsQuery({
    refetchOnMountOrArgChange: true,
  });
  console.log("Requested Gifts==>", requests);
  console.log("Data Recieved==>", data);
  const cards = [
    {
      id: 1,
      icon: FaPaperPlane,
      title: "My Requests",
      userName: "Emma Wilson",
      packageName: "Luxury Spa Package • $85",

      status: "Pending",
      statusColor: "#FF9500",
      statusBg: "#FF950033",
    },
    {
      id: 2,
      icon: FaGift,
      title: "Received Requests",
      userName: "From: Mike Davis",
      packageName: "Luxury Spa Package • $85",

      status: "Redeemed",
      statusColor: "#4FCF00",
      statusBg: "#4FCF0033",
    },
    {
      id: 3,
      icon: SlCalender,
      title: "Appointments",
      userName: "Luxe Beauty Salon",
      packageName: "Hair color, nail polish...",

      status: "Accepted",
      statusColor: "#4FCF00",
      statusBg: "#4FCF0033",
    },
  ];

  return (
    <div className="w-full max-w-full ">
      <div
        className="
          grid gap-8
          sm:grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-3
          justify-between
        "
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        {cards.map((card) => (
          <GiftCard key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
}
