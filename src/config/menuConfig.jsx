import { FaChartLine, FaCalendarDays } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";

import { FaGift } from "react-icons/fa";
import { GiOfficeChair } from "react-icons/gi";
import { BsEnvelopePaperHeart } from "react-icons/bs";
import { LuUserRoundPlus } from "react-icons/lu";
export const menus = {
  admin: [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaChartLine className="h-5 w-5" />,
    },
    {
      name: "Salons",
      path: "/salons",
      icon: <GiOfficeChair className="h-5 w-5" />,
    },
    {
      name: "Gifts",
      path: "/gifts",
      icon: <FaGift className="h-5 w-5" />,
    },
    {
      name: "Invites",
      path: "/saloninvites",
      icon: <LuUserRoundPlus className="h-5 w-5" />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <FaCalendarDays className="h-5 w-5" />,
    },
    {
      name: "Payouts",
      path: "/payouts",
      icon: <MdPayments className="h-5 w-5" />,
    },
  ],
  salonOwner: [
    {
      name: "Dashboard",
      path: "/salon-owner",
      icon: <FaChartLine className="h-5 w-5" />,
    },
    {
      name: "Invites",
      path: "/saloninvites",
      icon: <LuUserRoundPlus className="h-5 w-5" />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <FaCalendarDays className="h-5 w-5" />,
    },
  ],
  customer: [
    {
      name: "Dashboard",
      path: "/client",
      icon: <FaChartLine className="h-5 w-5" />,
    },

    {
      name: "Salons",
      path: "/salons",
      icon: <GiOfficeChair className="h-5 w-5" />,
    },
    {
      name: "Gifts",
      path: "/gifts",
      icon: <FaGift className="h-5 w-5" />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <FaCalendarDays className="h-5 w-5" />,
    },
    {
      name: "Salon Invites",
      path: "/saloninvites",
      icon: <BsEnvelopePaperHeart className="h-5 w-5" />,
    },
  ],
};
