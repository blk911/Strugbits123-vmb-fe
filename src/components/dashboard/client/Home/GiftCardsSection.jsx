import { FaGift, FaPaperPlane } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import GiftCard from "./GiftCard";
import {
  useRecievedGiftsQuery,
  useRequestedGiftsQuery,
} from "../../../../store/api";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";

export default function GiftCardsSection() {
  const { data: requestedGiftsData, isLoading: loadingRequested } =
    useRequestedGiftsQuery({ refetchOnMountOrArgChange: true });

  const { data: receivedGiftsData, isLoading: loadingReceived } =
    useRecievedGiftsQuery({ refetchOnMountOrArgChange: true });

  const firstRequestedGift = requestedGiftsData?.data?.items?.[0];
  const firstReceivedGift = receivedGiftsData?.data?.items?.[0];
  const loading = loadingReceived || loadingRequested;
  const cards = [
    {
      id: 1,
      icon: FaPaperPlane,
      title: "My Requests",
      hasData: !!firstRequestedGift,
      userName: firstRequestedGift?.receiverEmail || "No requests yet",
      packageName: firstRequestedGift
        ? `${firstRequestedGift.services.length} service${
            firstRequestedGift.services.length > 1 ? "s" : ""
          } • $${firstRequestedGift.services.reduce(
            (a, b) => a + b.servicePrice,
            0
          )}`
        : null,
      status: firstRequestedGift?.status || null,
      statusColor:
        firstRequestedGift?.status === "pending"
          ? "#FF9500"
          : firstRequestedGift?.status === "accepted"
          ? "#4FCF00"
          : "#EF4444",
      statusBg:
        firstRequestedGift?.status === "pending"
          ? "#FF950033"
          : firstRequestedGift?.status === "accepted"
          ? "#4FCF0033"
          : "#EF444433",
      data: firstRequestedGift,
    },
    {
      id: 2,
      icon: FaGift,
      title: "Received Requests",
      hasData: !!firstReceivedGift,
      userName: firstReceivedGift
        ? `From: ${firstReceivedGift.requesterId?.name || "Someone"}`
        : "No requests yet",
      packageName: firstReceivedGift
        ? `${firstReceivedGift.services.length} service${
            firstReceivedGift.services.length > 1 ? "s" : ""
          } • $${firstReceivedGift.services.reduce(
            (a, b) => a + b.servicePrice,
            0
          )}`
        : null,
      status: firstReceivedGift?.isPaid ? "Redeemed" : "Pending",
      statusColor: firstReceivedGift?.isPaid ? "#4FCF00" : "#FF9500",
      statusBg: firstReceivedGift?.isPaid ? "#4FCF0033" : "#FF950033",
      data: firstReceivedGift,
    },
    {
      id: 3,
      icon: SlCalender,
      title: "Appointments",
      userName: "Luxe Beauty Salon",
      packageName: "Hair color, nail polish...",
      status: "Upcoming",
      statusColor: "#4FCF00",
      statusBg: "#4FCF0033",
    },
  ];

  return (
    <>
      <div className="w-full max-w-full">
        <div
          className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {cards.map((card) => (
            <GiftCard key={card.id} {...card} isLoading={loading} />
          ))}
        </div>
      </div>
    </>
  );
}
