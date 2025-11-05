import { FaChartLine } from "react-icons/fa6";
import { PiOfficeChairFill } from "react-icons/pi";
import { LiaDollarSignSolid } from "react-icons/lia";
import { FaGift } from "react-icons/fa";

export const menus = {
  admin: [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaChartLine className='h-5 w-5'/>,
    },
    {
      name: "Saloons",
      path: "/admin/saloon",
      icon: <PiOfficeChairFill className='h-5 w-5'/>,
    },
    {
      name: "Earnings",
      path: "/admin/earnings",
      icon: <LiaDollarSignSolid className='h-5 w-5'/>,
    },
    {
      name: "Invites & Gifts",
      path: "/admin/invites_gifts",
      icon: <FaGift className='h-5 w-5'/>,
    },
  ],
  salonOwner: [
    {
      name: "Dashboard",
      path: "/salonOwner",
      icon: <FaChartLine />,
    },
    {
      name: "Earnings",
      path: "/salonOwner/earnings",
      icon: <LiaDollarSignSolid />,
    },
    {
      name: "Invites & Gifts",
      path: "/salonOwner/invites_gifts",
      icon: <FaGift />,
    },
  ],
  client: [
    {
      name: "Dashboard",
      path: "/client",
      icon: <FaChartLine />,
    },
    {
      name: "Earnings",
      path: "/client/earnings",
      icon: <LiaDollarSignSolid />,
    },
    {
      name: "Invites & Gifts",
      path: "/client/invites_gifts",
      icon: <FaGift />,
    },
  ],
};
