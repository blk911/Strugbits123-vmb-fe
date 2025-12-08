import { FaGift, FaPaperPlane } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import GiftCard from "./GiftCard";
import {
  useGetUserAppointmentsQuery,
  useRecievedGiftsQuery,
  useRequestedGiftsQuery,
} from "../../../../store/api";
import LoadingIndicator from "../../../common/LoadingIndicator/LoadingIndicator";
import { useEffect, useMemo } from "react";
import { capitalizeFirst } from "../../../../utils/HelperFunctions";

export default function GiftCardsSection() {
  const {
    data: requestedGiftsData,
    isLoading: loadingRequested,
    refetch: refetchRequested,
  } = useRequestedGiftsQuery({
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const {
    data: receivedGiftsData,
    isLoading: loadingReceived,
    refetch: refetchReceived,
  } = useRecievedGiftsQuery({
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const {
    data: pendingData,
    isLoading: loadingPending,
    refetch: refetchPending,
  } = useGetUserAppointmentsQuery({
    sort: "newest",
    status: "pending",
  });
  console.log("Pending Appointments Data==>", pendingData);
  useEffect(() => {
    refetchRequested();
    refetchReceived();
    refetchPending();
  }, [refetchRequested, refetchReceived, refetchPending]);
  const firstRequestedGift = useMemo(() => {
    const items = requestedGiftsData?.data?.items;
    if (!items || items.length === 0) return null;

    return items
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  }, [requestedGiftsData]);

  const firstReceivedGift = useMemo(() => {
    const items = receivedGiftsData?.data?.items;
    if (!items || items.length === 0) return null;

    return items
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  }, [receivedGiftsData]);

  const firstPendingAppointment = useMemo(() => {
    const items = pendingData?.data?.items;
    if (!items || items.length === 0) return null;

    return items
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  });
  console.log("firstPendingAppointment==>", firstPendingAppointment);
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
      status: capitalizeFirst(firstRequestedGift?.status) || null,
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

      status: capitalizeFirst(firstReceivedGift?.status) || null,
      statusColor:
        firstReceivedGift?.status === "pending"
          ? "#FF9500"
          : firstReceivedGift?.status === "accepted"
          ? "#4FCF00"
          : "#EF4444",
      statusBg:
        firstReceivedGift?.status === "pending"
          ? "#FF950033"
          : firstReceivedGift?.status === "accepted"
          ? "#4FCF0033"
          : "#EF444433",
      data: firstReceivedGift,
    },
    {
      id: 3,
      icon: SlCalender,
      title: "Appointments",
      hasData: !!firstPendingAppointment,
      userName: firstPendingAppointment?.requestedBy?.name || "Someone",
      packageName:
        firstPendingAppointment?.services?.map((s) => s.name).join(", ") ||
        null,
      status: "Pending",
      statusColor: "#FF9500",
      statusBg: "#FF950033",
      data: firstPendingAppointment,
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
