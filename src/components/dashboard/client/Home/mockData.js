import saloon_icon from "../../../../assets/default_saloon.png";
import saloon_1 from "../../../../assets/salon-1.png";
import saloon_2 from "../../../../assets/salon-2.png";
import saloon_3 from "../../../../assets/salon-3.png";

const uniqueServices = [
  {
    name: "Classic Haircut & Style",
    duration: 45,
    price: 55,
    description: "Precision cut with blow-dry and styling for a polished look.",
  },
  {
    name: "Balayage Highlights",
    duration: 180,
    price: 180,
    description: "Hand-painted highlights for a natural, sun-kissed glow.",
  },
  {
    name: "HydraFacial Deluxe",
    duration: 60,
    price: 120,
    description: "Deep cleansing, exfoliation, extraction, and hydration.",
  },
  {
    name: "Keratin Smoothing Treatment",
    duration: 150,
    price: 250,
    description: "Frizz-free, silky hair for up to 5 months.",
  },
  {
    name: "Full Head Color",
    duration: 120,
    price: 95,
    description: "Rich, vibrant color with root touch-up and gloss.",
  },
  {
    name: "Luxury Manicure & Pedicure",
    duration: 90,
    price: 85,
    description: "Includes exfoliation, massage, and gel polish.",
  },
  {
    name: "Lash Lift & Tint",
    duration: 60,
    price: 75,
    description: "Natural curl and darker lashes — no extensions needed.",
  },
  {
    name: "Gentlemen's Grooming Package",
    duration: 75,
    price: 70,
    description: "Haircut, beard trim, hot towel, and scalp massage.",
  },
  {
    name: "Anti-Aging Facial",
    duration: 75,
    price: 140,
    description: "Collagen mask, LED therapy, and firming massage.",
  },
  {
    name: "Body Wax (Full Legs + Brazilian)",
    duration: 90,
    price: 110,
    description: "Smooth, long-lasting hair removal with premium wax.",
  },
];

// const makeServices = (salonIndex) =>
//   uniqueServices.map((service, i) => ({
//     id: `${salonIndex}-${i + 1}`,
//     ...service,
//     price: service.price + (salonIndex % 3) * 10,
//     image: saloon_1,
//   }));
// mockData.js — Update makeServices function

const makeServices = (salonIndex) =>
  uniqueServices.map((service, i) => ({
    id: `${salonIndex}-${i + 1}`,
    name: service.name,
    duration: service.duration,
    price: service.price + (salonIndex % 3) * 10,
    description: service.description,
    image: saloon_1,

    discount: 10,
    isDefault: i === 0,
  }));
export const salons = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Bella Beauty Salon ${i + 1}`,
  distance: parseFloat((Math.random() * 5 + 0.5).toFixed(1)),
  address: "123 Main Street, Cityville",
  phone: `(555) 123-${4567 + i}`,
  image: saloon_icon,
  images: [saloon_1, saloon_2, saloon_3],
  description:
    "A luxurious beauty salon offering premium hair, skin, and nail services with highly trained professionals.",
  workingHours: { start: "9:00 AM", end: "8:00 PM" },
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  services: makeServices(i + 1),

  licenseDocument: null,
  salonPhotos: [saloon_1, saloon_2, saloon_3],
  owner: {
    fullName: `Sarah Johnson ${i + 1}`,
    email: `sarah${i + 1}@bellabeauty.com`,
  },
}));
