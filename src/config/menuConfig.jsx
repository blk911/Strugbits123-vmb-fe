import { FaChartLine, FaCalendarDays } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";

import { FaGift } from "react-icons/fa";
import { GiOfficeChair } from "react-icons/gi";
import { BsEnvelopePaperHeart } from "react-icons/bs";
import {
  LuContact,
  LuFlaskConical,
  LuHeadphones,
  LuKeyRound,
  LuSettings,
  LuShare2,
  LuUserCog,
  LuUserRoundPlus,
  LuCloudUpload,
  LuChartColumn,
} from "react-icons/lu";
import { IoIosPeople } from "react-icons/io";
import { BsArchiveFill } from "react-icons/bs";
export const menus = {
  admin: [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaChartLine className="h-5 w-5" />,
    },
    {
      name: "Intelligence Lab",
      path: "/admin/intelligence-lab",
      icon: <LuFlaskConical className="h-5 w-5" />,
      allowedRoles: ["admin"],
    },
    {
      name: "Credential Assist",
      path: "/admin/credential-assist",
      icon: <LuKeyRound className="h-5 w-5" />,
      allowedRoles: ["admin"],
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
      path: "/salon-invites",
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
    {
      name: "Customers",
      path: "/customers",
      icon: <IoIosPeople className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/admin/settings/staff",
      icon: <LuSettings className="h-5 w-5" />,
      allowedRoles: ["admin"],
      children: [
        {
          name: "Staff",
          path: "/admin/settings/staff",
          icon: <LuUserCog className="h-4 w-4" />,
          allowedRoles: ["admin"],
        },
        {
          name: "Support",
          path: "/admin/settings/support",
          icon: <LuHeadphones className="h-4 w-4" />,
          allowedRoles: ["admin"],
        },
        {
          name: "Contacts",
          path: "/admin/settings/contacts",
          icon: <LuContact className="h-4 w-4" />,
          allowedRoles: ["admin"],
        },
        {
          name: "Lab",
          path: "/admin/lab",
          icon: <LuShare2 className="h-4 w-4" />,
          allowedRoles: ["admin"],
        },
      ],
    },
    {
      name: "Service Presets",
      path: "/service-presets",
      icon: <BsArchiveFill className="h-5 w-5" />,
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
      path: "/salon-invites",
      icon: <LuUserRoundPlus className="h-5 w-5" />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <FaCalendarDays className="h-5 w-5" />,
    },
    {
      name: "Service Presets",
      path: "/service-presets",
      icon: <BsArchiveFill className="h-5 w-5" />,
    },
    { type: "divider" },
    {
      name: "tAIkOS",
      subtext: "Deep Foresights",
      path: "/salon-owner/deep-insights/data-capture",
      groupPath: "/salon-owner/deep-insights",
      menuIconUnstyled: true,
      icon: (
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-vmb-gold/50 bg-slate-950 text-[11px] font-bold text-vmb-gold">
          AI
        </div>
      ),
      children: [
        {
          name: "Data Capture",
          path: "/salon-owner/deep-insights/data-capture",
          icon: <LuCloudUpload className="h-4 w-4" />,
        },
        {
          name: "Analytics",
          path: "/salon-owner/deep-insights/analytics",
          icon: <LuChartColumn className="h-4 w-4" />,
        },
      ],
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
      path: "/salon-invites",
      icon: <BsEnvelopePaperHeart className="h-5 w-5" />,
    },
  ],
};
