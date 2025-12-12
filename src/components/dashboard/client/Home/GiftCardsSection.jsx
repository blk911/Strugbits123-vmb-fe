import { FaGift, FaPaperPlane } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import GiftCard from "./GiftCard";
import {
  useGetUserAppointmentsQuery,
  useRecievedGiftsQuery,
  useRequestedGiftsQuery,
} from "../../../../store/api";
import { useEffect, useMemo } from "react";
import { formatTimeAgo } from "../../../../utils/HelperFunctions";

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
  useEffect(() => {
    refetchRequested();
    refetchReceived();
    refetchPending();
  }, [refetchRequested, refetchReceived, refetchPending]);

  const loading = loadingRequested || loadingReceived || loadingPending;

  const recentRequested = useMemo(() => {
    const items = requestedGiftsData?.data?.items || [];
    return items
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
  }, [requestedGiftsData]);

  const recentReceived = useMemo(() => {
    const items = receivedGiftsData?.data?.items || [];
    return items
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
  }, [receivedGiftsData]);

  const recentPendingAppointments = useMemo(() => {
    const items = pendingData?.data?.items || [];
    return items
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
  }, [pendingData]);
  const cards = [
    {
      id: 1,
      icon: FaPaperPlane,
      title: "My Requests",
      items: recentRequested,
      emptyMessage: "No requests sent yet",
    },
    {
      id: 2,
      icon: FaGift,
      title: "Received Requests",
      items: recentReceived,
      emptyMessage: "No gifts received yet",
    },
    {
      id: 3,
      icon: SlCalender,
      title: "Appointments",
      items: recentPendingAppointments,
      emptyMessage: "No pending appointments",
    },
  ];

  return (
    <div className="w-full max-w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {cards.map((card) => (
          <GiftCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            items={card.items}
            emptyMessage={card.emptyMessage}
            isLoading={loading}
            formatTimeAgo={formatTimeAgo}
          />
        ))}
      </div>
    </div>
  );
}
